import CoreData
import SwiftUI
import Swinject

extension DataTable {
    struct RootView: BaseView {
        let resolver: Resolver
        @StateObject var state = StateModel()

        @State private var isRemoveTreatmentAlertPresented: Bool = false
        @State private var removeTreatmentAlert: Alert?
        @State private var isRemoveCarbsAlertPresented: Bool = false
        @State private var removeCarbsAlert: Alert?
        @State private var isRemoveInsulinAlertPresented: Bool = false
        @State private var removeInsulinAlert: Alert?
        @State private var showNonPumpInsulin: Bool = false
        @State private var showFutureEntries: Bool = false // default to hide future entries
        @State private var showManualGlucose: Bool = false
        @State private var isAmountUnconfirmed: Bool = true
        @State private var alertTitle = ""
        @State private var alertMessage = ""
        @State private var alertTreatmentToDelete: Treatment?

        @Environment(\.colorScheme) var colorScheme

        private var fpuFormatter: NumberFormatter {
            let formatter = NumberFormatter()
            formatter.numberStyle = .decimal
            formatter.maximumFractionDigits = 1
            formatter.roundingMode = .halfUp
            return formatter
        }

        private var insulinFormatter: NumberFormatter {
            let formatter = NumberFormatter()
            formatter.numberStyle = .decimal
            formatter.maximumFractionDigits = 2
            return formatter
        }

        private var glucoseFormatter: NumberFormatter {
            let formatter = NumberFormatter()
            formatter.numberStyle = .decimal
            formatter.maximumFractionDigits = 0
            if state.units == .mmolL {
                formatter.maximumFractionDigits = 1
                formatter.roundingMode = .ceiling
            }
            return formatter
        }

        private var dateFormatter: DateFormatter {
            let formatter = DateFormatter()
            formatter.timeStyle = .short
            return formatter
        }

        var body: some View {
            VStack {
                Picker("Mode", selection: $state.mode) {
                    ForEach(Mode.allCases.indexed(), id: \.1) { index, item in
                        Text(item.name).tag(index)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding(.horizontal)

                Form {
                    switch state.mode {
                    case .treatments: treatmentsList
                    case .glucose: glucoseList
                    }
                }
            }
            .onAppear(perform: configureView)
            .navigationTitle("History")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(leading: Button("Close", action: state.hideModal))
            .sheet(isPresented: $showManualGlucose) {
                addGlucoseView
            }
            .sheet(isPresented: $showNonPumpInsulin, onDismiss: { if isAmountUnconfirmed { state.nonPumpInsulinAmount = 0
                state.nonPumpInsulinDate = Date() } }) {
                addNonPumpInsulinView
            }
        }

        private var treatmentsList: some View {
            List {
                HStack {
                    Button(action: { showNonPumpInsulin = true
                        state.nonPumpInsulinDate = Date() }, label: {
                        HStack {
                            Image(systemName: "syringe")
                            Text("Add")
                                .foregroundColor(Color.secondary)
                                .font(.caption)
                        }.frame(maxWidth: .infinity, alignment: .leading)
                    }).buttonStyle(.borderless)

                    Spacer()

                    Button(action: { showFutureEntries.toggle() }, label: {
                        HStack {
                            Text(showFutureEntries ? "Hide Future" : "Show Future")
                                .foregroundColor(Color.secondary)
                                .font(.caption)
                            Image(systemName: showFutureEntries ? "calendar.badge.minus" : "calendar.badge.plus")
                        }.frame(maxWidth: .infinity, alignment: .trailing)
                    }).buttonStyle(.borderless)
                }
                if !state.treatments.isEmpty {
                    if !showFutureEntries {
                        ForEach(state.treatments.filter({ $0.date <= Date() })) { item in
                            treatmentView(item)
                                .deleteDisabled(
                                    item.type == .tempBasal || item.type == .tempTarget || item
                                        .type == .suspend || item.type == .resume
                                )
                                .alert(
                                    Text(NSLocalizedString(alertTitle, comment: "Alert title for treatment deletion")),
                                    isPresented: $isRemoveTreatmentAlertPresented
                                ) {
                                    Button("Cancel", role: .cancel) {}
                                    Button("Delete", role: .destructive) {
                                        // gracefully unwrap value here. value cannot ever really be nil because it is an existing(!) table entry.
                                        guard let treatmentToDelete = alertTreatmentToDelete else {
                                            // couldn't delete
                                            return
                                        }

                                        if treatmentToDelete.type == .carbs || treatmentToDelete.type == .fpus {
                                            state.deleteCarbs(treatmentToDelete)
                                        } else {
                                            state.deleteInsulin(treatmentToDelete)
                                        }
                                    }
                                } message: {
                                    Text("\n" + NSLocalizedString(alertMessage, comment: "Alert title for message deletion"))
                                }
                        }.onDelete(perform: deleteTreatment)
                    } else {
                        ForEach(state.treatments) { item in
                            treatmentView(item)
                                .deleteDisabled(
                                    item.type == .tempBasal || item.type == .tempTarget || item
                                        .type == .suspend || item.type == .resume
                                )
                                .alert(
                                    Text(alertTitle),
                                    isPresented: $isRemoveTreatmentAlertPresented
                                ) {
                                    Button("Cancel", role: .cancel) {}
                                    Button("Delete", role: .destructive) {
                                        // gracefully unwrap value here. value cannot ever really be nil because it is an existing(!) table entry.
                                        guard let treatmentToDelete = alertTreatmentToDelete else {
                                            // couldn't delete
                                            return
                                        }

                                        if treatmentToDelete.type == .carbs || treatmentToDelete.type == .fpus {
                                            state.deleteCarbs(treatmentToDelete)
                                        } else {
                                            state.deleteInsulin(treatmentToDelete)
                                        }
                                    }
                                } message: {
                                    Text("\n" + alertMessage)
                                }
                        }.onDelete(perform: { indexSet in
                            deleteTreatment(at: indexSet)
                        })
                    }
                } else {
                    HStack {
                        Text("No data.")
                    }
                }
            }
        }

        private var glucoseList: some View {
            List {
                HStack {
                    Button(
                        action: { showManualGlucose = true
                            state.manualGlucose = 0 },
                        label: { Image(systemName: "plus.circle.fill").foregroundStyle(.secondary)
                        }
                    ).buttonStyle(.borderless)
                    Text(state.units.rawValue).foregroundStyle(.secondary)
                    Spacer()
                    Text("Time").foregroundStyle(.secondary)
                }
                if !state.glucose.isEmpty {
                    ForEach(state.glucose) { item in
                        glucoseView(item, isManual: item.glucose)
                    }
                    .onDelete(perform: deleteGlucose)
                } else {
                    HStack {
                        Text("No data.")
                    }
                }
            }
        }

        var addGlucoseView: some View {
            NavigationView {
                VStack {
                    Form {
                        Section {
                            HStack {
                                Text("New Glucose")
                                DecimalTextField(
                                    " ... ",
                                    value: $state.manualGlucose,
                                    formatter: glucoseFormatter,
                                    autofocus: true,
                                    cleanInput: true
                                )
                                Text(state.units.rawValue).foregroundStyle(.secondary)
                            }
                        }

                        Section {
                            HStack {
                                let limitLow: Decimal = state.units == .mmolL ? 0.8 : 40
                                let limitHigh: Decimal = state.units == .mgdL ? 14 : 720
                                Button {
                                    state.addManualGlucose()
                                    isAmountUnconfirmed = false
                                    showManualGlucose = false
                                }
                                label: { Text("Save") }
                                    .frame(maxWidth: .infinity, alignment: .center)
                                    .disabled(state.manualGlucose < limitLow || state.manualGlucose > limitHigh)
                            }
                        }
                    }
                }
                .onAppear(perform: configureView)
                .navigationTitle("Add Glucose")
                .navigationBarTitleDisplayMode(.automatic)
                .navigationBarItems(leading: Button("Close", action: { showManualGlucose = false }))
            }
        }

        @ViewBuilder private func treatmentView(_ item: Treatment) -> some View {
            HStack {
                if item.type == .carbs || item.type == .bolus {
                    Image(systemName: "circle.fill").foregroundColor(item.color).padding(.vertical)
                } else {
                    Image(systemName: "circle.fill").foregroundColor(item.color)
                }
                Text((item.isSMB ?? false) ? "SMB" : item.type.name)
                Text(item.amountText).foregroundColor(.secondary)

                if let duration = item.durationText {
                    Text(duration).foregroundColor(.secondary)
                }

                if item.type == .carbs {
                    if item.note != "" {
                        Spacer()
                        Text(item.note ?? "").foregroundColor(.brown)
                    }
                }
                Spacer()
                Text(dateFormatter.string(from: item.date))
                    .moveDisabled(true)
            }
        }

        var addNonPumpInsulinView: some View {
            NavigationView {
                VStack {
                    Form {
                        Section {
                            HStack {
                                Text("Amount")
                                Spacer()
                                DecimalTextField(
                                    "0",
                                    value: $state.nonPumpInsulinAmount,
                                    formatter: insulinFormatter,
                                    autofocus: true,
                                    cleanInput: true
                                )
                                Text("U").foregroundColor(.secondary)
                            }
                        }

                        Section {
                            DatePicker("Date", selection: $state.nonPumpInsulinDate, in: ...Date())
                        }

                        let amountWarningCondition = (state.nonPumpInsulinAmount > state.maxBolus)

                        Section {
                            HStack {
                                Button {
                                    state.addNonPumpInsulin()
                                    isAmountUnconfirmed = false
                                    showNonPumpInsulin = false
                                }
                                label: {
                                    Text("Log non-pump insulin")
                                }
                                .foregroundColor(amountWarningCondition ? Color.white : Color.accentColor)
                                .frame(maxWidth: .infinity, alignment: .center)
                                .disabled(
                                    state.nonPumpInsulinAmount <= 0 || state.nonPumpInsulinAmount > state.maxBolus * 3
                                )
                            }
                        }
                        header: {
                            if amountWarningCondition
                            {
                                Text("⚠️ Warning! The entered insulin amount is greater than your Max Bolus setting!")
                            }
                        }
                        .listRowBackground(
                            amountWarningCondition ? Color
                                .red : colorScheme == .dark ? Color(UIColor.secondarySystemBackground) : Color.white
                        )
                    }
                }
                .onAppear(perform: configureView)
                .navigationTitle("Non-Pump Insulin")
                .navigationBarTitleDisplayMode(.inline)
                .navigationBarItems(leading: Button("Close", action: { showNonPumpInsulin = false
                    state.nonPumpInsulinAmount = 0 }))
            }
        }

        @ViewBuilder private func glucoseView(_ item: Glucose, isManual: BloodGlucose) -> some View {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(item.glucose.glucose.map {
                        glucoseFormatter.string(from: Double(
                            state.units == .mmolL ? $0.asMmolL : Decimal($0)
                        ) as NSNumber)!
                    } ?? "--")
                    if isManual.type == GlucoseType.manual.rawValue {
                        Image(systemName: "drop.fill").symbolRenderingMode(.monochrome).foregroundStyle(.red)
                    } else {
                        Text(item.glucose.direction?.symbol ?? "--")
                    }
                    Spacer()

                    Text(dateFormatter.string(from: item.glucose.dateString))
                }
            }
        }

        private func setAlertContent(_ treatment: Treatment) {
            if treatment.type == .carbs || treatment.type == .fpus {
                if treatment.type == .fpus {
                    let fpus = state.treatments
                    let carbEquivalents = fpuFormatter.string(from: Double(
                        fpus.filter { fpu in
                            fpu.fpuID == treatment.fpuID
                        }
                        .map { fpu in
                            fpu.amount ?? 0 }
                        .reduce(0, +)
                    ) as NSNumber)!

                    alertTitle = "Delete Carb Equivalents?"
                    alertMessage = carbEquivalents + NSLocalizedString(" g", comment: "gram of carbs")
                }

                if treatment.type == .carbs {
                    alertTitle = "Delete Carbs?"
                    alertMessage = treatment.amountText
                }
            } else {
                // treatment is .bolus
                alertTitle = "Delete Insulin?"
                alertMessage = treatment.amountText
            }
        }

        private func deleteTreatment(at offsets: IndexSet) {
            if let indexToDelete = offsets.first {
                let treatment = showFutureEntries ? state.treatments[indexToDelete] : state.treatments
                    .filter { $0.date <= Date() }[indexToDelete]

                alertTreatmentToDelete = treatment
                setAlertContent(treatment)

                isRemoveTreatmentAlertPresented = true
            }
        }

        private func deleteGlucose(at offsets: IndexSet) {
            state.deleteGlucose(at: offsets[offsets.startIndex])
        }
    }
}
