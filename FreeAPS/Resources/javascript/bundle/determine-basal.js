var freeaps_determineBasal;(()=>{var e={5546:(e,t,a)=>{var r=a(6880);function o(e,t){t||(t=0);var a=Math.pow(10,t);return Math.round(e*a)/a}function n(e,t){return"mmol/L"===t.out_units?o(.0555*e,1):Math.round(e)}e.exports=function(e,t,a,i,s,l,m,u,d,c,g,h,p,f){var b=i.min_bg,v=0,B="",M="",_="",y="",x="",w=0,D=0,S=0,T=0,C=0,U=0;const G=f.weightedAverage,R=i.weightPercentage,O=f.average_total_data;function A(e,t){var a=e.getTime();return new Date(a+36e5*t)}function I(e){var t=i.bolus_increment;.025!=t&&(t=.05);var a=e/t;return a>=1?o(Math.floor(a)*t,5):0}function j(e){function t(e){return e<10&&(e="0"+e),e}return t(e.getHours())+":"+t(e.getMinutes())+":00"}function F(e,t){var a=new Date("1/1/1999 "+e),r=new Date("1/1/1999 "+t);return(a.getTime()-r.getTime())/36e5}function P(e,t){var a=0,r=t,o=(e-t)/36e5,n=0,i=o,s=0;do{if(o>0){var l=j(r),m=p[0].rate;for(let e=0;e<p.length;e++){var u=p[e].start;if(l==u){if(e+1<p.length){o>=(s=F(p[e+1].start,p[e].start))?n=s:o<s&&(n=o)}else if(e+1==p.length){let t=p[0].start;o>=(s=24-F(p[e].start,t))?n=s:o<s&&(n=o)}a+=I((m=p[e].rate)*n),o-=n,console.log("Dynamic ratios log: scheduled insulin added: "+I(m*n)+" U. Bas duration: "+n.toPrecision(3)+" h. Base Rate: "+m+" U/h. Time :"+l),r=A(r,n)}else if(l>u)if(e+1<p.length){var d=p[e+1].start;l<d&&(o>=(s=F(d,l))?n=s:o<s&&(n=o),a+=I((m=p[e].rate)*n),o-=n,console.log("Dynamic ratios log: scheduled insulin added: "+I(m*n)+" U. Bas duration: "+n.toPrecision(3)+" h. Base Rate: "+m+" U/h. Time :"+l),r=A(r,n))}else if(e==p.length-1){o>=(s=F("23:59:59",l))?n=s:o<s&&(n=o),a+=I((m=p[e].rate)*n),o-=n,console.log("Dynamic ratios log: scheduled insulin added: "+I(m*n)+" U. Bas duration: "+n.toPrecision(3)+" h. Base Rate: "+m+" U/h. Time :"+l),r=A(r,n)}}}}while(o>0&&o<i);return a}if(g.length){let e=g.length-1;var q=new Date(g[e].timestamp),W=new Date(g[0].timestamp);if("TempBasalDuration"==g[0]._type&&(W=new Date),(v=(W-q)/36e5)<23.9&&v>21)C=P(q,(E=24-v,k=q.getTime(),new Date(k-36e5*E))),y="24 hours of data is required for an accurate tdd calculation. Currently only "+v.toPrecision(3)+" hours of pump history data are available. Using your pump scheduled basals to fill in the missing hours. Scheduled basals added: "+C.toPrecision(5)+" U. ";else v<21?(Y=!1,enableDynamicCR=!1):y=""}else console.log("Pumphistory is empty!"),Y=!1,enableDynamicCR=!1;var E,k;for(let e=0;e<g.length;e++)"Bolus"==g[e]._type&&(T+=g[e].amount);for(let e=1;e<g.length;e++)if("TempBasal"==g[e]._type&&g[e].rate>0){w=e,U=g[e].rate;var L=g[e-1]["duration (min)"]/60,z=L,N=new Date(g[e-1].timestamp),Z=N,H=0;do{if(e--,0==e){Z=new Date;break}if("TempBasal"==g[e]._type||"PumpSuspend"==g[e]._type){Z=new Date(g[e].timestamp);break}var $=e-2;if($>=0&&"Rewind"==g[$]._type){let e=g[$].timestamp;for(;$-1>=0&&"Prime"==g[$-=1]._type;)H=(g[$].timestamp-e)/36e5;H>=L&&(Z=e,H=0)}}while(e>0);var J=(Z-N)/36e5;J<z&&(L=J),S+=I(U*(L-H)),e=w}for(let e=0;e<g.length;e++)if(0,0==g[e]["duration (min)"]||"PumpResume"==g[e]._type){let t=new Date(g[e].timestamp),a=t,r=e;do{if(r>0&&(--r,"TempBasal"==g[r]._type)){a=new Date(g[r].timestamp);break}}while(r>0);(a-t)/36e5>0&&(C+=P(a,t))}for(let e=g.length-1;e>0;e--)if("TempBasalDuration"==g[e]._type){let t=g[e]["duration (min)"]/60,a=new Date(g[e].timestamp);var K=a;let r=e;do{if(--r,r>=0&&("TempBasal"==g[r]._type||"PumpSuspend"==g[r]._type)){K=new Date(g[r].timestamp);break}}while(r>0);if(0==e&&"TempBasalDuration"==g[0]._type&&(K=new Date,t=g[e]["duration (min)"]/60),(K-a)/36e5-t>0){C+=P(K,A(a,t))}}var Q,V={TDD:o(D=T+S+C,5),bolus:o(T,5),temp_basal:o(S,5),scheduled_basal:o(C,5)};v>21?(M=". Bolus insulin: "+T.toPrecision(5)+" U",_=". Temporary basal insulin: "+S.toPrecision(5)+" U",B=". Insulin with scheduled basal rate: "+C.toPrecision(5)+" U",x=y+(" TDD past 24h is: "+D.toPrecision(5)+" U")+M+_+B,tddReason=", Total insulin: "+o(D,2)+" U "):tddReason=", TDD: Not enough pumpData (< 21h)";const X=e.glucose;var Y=h.useNewFormula;const ee=h.enableDynamicCR,te=Math.min(i.autosens_min,i.autosens_max),ae=Math.max(i.autosens_min,i.autosens_max),re=h.adjustmentFactor,oe=i.min_bg;var ne=!1,ie="",se=1,le="";O>0&&(se=G/O),le=se>1?"Basal adjustment with a 24 hour  to total average (up to 14 days of data) TDD ratio (limited by Autosens max setting). Basal Ratio: "+(se=o(se=Math.min(se,i.autosens_max),2))+". Upper limit = Autosens max ("+i.autosens_max+")":se<1?"Basal adjustment with a 24 hour to  to total average (up to 14 days of data) TDD ratio (limited by Autosens min setting). Basal Ratio: "+(se=o(se=Math.max(se,i.autosens_min),2))+". Lower limit = Autosens min ("+i.autosens_min+")":"Basal adjusted with a 24 hour to total average (up to 14 days of data) TDD ratio: "+se,le=", Basal ratio: "+se,(i.high_temptarget_raises_sensitivity||i.exercise_mode||f.isEnabled)&&(ne=!0),oe>=118&&ne&&(Y=!1,ie="Dynamic ISF temporarily off due to a high temp target/exercising. Current min target: "+oe);var me=", Dynamic ratios log: ",ue=", AF: "+re,de="BG: "+X+" mg/dl ("+(.0555*X).toPrecision(2)+" mmol/l)",ce="",ge="";const he=h.curve,pe=h.insulinPeakTime,fe=h.useCustomPeakTime;var be=55,ve=65;switch(he){case"rapid-acting":ve=65;break;case"ultra-rapid":ve=50}fe?(be=120-pe,console.log("Custom insulinpeakTime set to :"+pe+", insulinFactor: "+be)):(be=120-ve,console.log("insulinFactor set to : "+be)),Q=D,R<1&&G>0&&(D=G,console.log("Using weighted TDD average: "+o(D,2)+" U, instead of past 24 h ("+o(Q,2)+" U), weight: "+R),ge=", Weighted TDD: "+o(D,2)+" U");const Be=h.sigmoid;var Me="";if(Y){var _e=i.sens*re*D*Math.log(X/be+1)/1800;ce=", Logarithmic formula"}var ye="";if(Y&&Be){const e=te,t=ae-e,a=.0555*(X-i.min_bg);var xe=se;const r=ae-1,n=Math.log10(1/r-e/r)/Math.log10(Math.E),s=a*re*xe+n;_e=t/(1+Math.exp(-s))+e,ce=", Sigmoid function"}var we=i.carb_ratio;const De=o(i.carb_ratio,1);var Se="",Te="";if(Y&&D>0){if(Se=", Dynamic ISF/CR: On/",_e>ae?(ie=", Dynamic ISF limited by autosens_max setting: "+ae+" ("+o(_e,2)+"), ",Te=", Autosens/Dynamic Limit: "+ae+" ("+o(_e,2)+")",_e=ae):_e<te&&(ie=", Dynamic ISF limjted by autosens_min setting: "+te+" ("+o(_e,2)+"). ",Te=", Autosens/Dynamic Limit: "+te+" ("+o(_e,2)+")",_e=te),ee){Se+="On";var Ce=_e;_e>1&&(Ce=(_e-1)/2+1);var Ue=" CR: "+(we=o(we/Ce,2))+" g/U";i.carb_ratio=we}else Ue=" CR: "+we+" g/U",Se+="Off";const e=i.sens/_e;Me=". Using Sigmoid function, the autosens ratio has been adjusted with sigmoid factor to: "+o(s.ratio,2)+". New ISF = "+o(e,2)+" mg/dl ("+o(.0555*e,2)+" (mmol/l). CR adjusted from "+o(we,2)+" to "+o(i.carb_ratio,2)+" ("+o(.0555*i.carb_ratio,2)+" mmol/l).",ie+=Be?Me:", Dynamic autosens.ratio set to "+o(_e,2)+" with ISF: "+e.toPrecision(3)+" mg/dl/U ("+(.0555*e).toPrecision(3)+" mmol/l/U)",s.ratio=_e,x+=me+de+ue+ce+ie+Se+Ue+ge}else x+=me+"Dynamic Settings disabled";console.log(x),Y||ee?Y&&i.tddAdjBasal?tddReason+=Se+ce+Te+ue+le:Y&&!i.tddAdjBasal&&(tddReason+=Se+ce+Te+ue):tddReason+="";var Ge={},Re=new Date;if(c&&(Re=c),void 0===i||void 0===i.current_basal)return Ge.error="Error: could not get current basal rate",Ge;var Oe=r(i.current_basal,i),Ae=Oe,Ie=new Date;c&&(Ie=c);var je,Fe=new Date(e.date),Pe=o((Ie-Fe)/60/1e3,1),qe=e.glucose,We=e.noise;je=e.delta>-.5?"+"+o(e.delta,0):o(e.delta,0);var Ee=Math.min(e.delta,e.short_avgdelta),ke=Math.min(e.short_avgdelta,e.long_avgdelta),Le=Math.max(e.delta,e.short_avgdelta,e.long_avgdelta);(qe<=10||38===qe||We>=3)&&(Ge.reason="CGM is calibrating, in ??? state, or noise is high");if(qe>60&&0==e.delta&&e.short_avgdelta>-1&&e.short_avgdelta<1&&e.long_avgdelta>-1&&e.long_avgdelta<1&&("fakecgm"==e.device?(console.error("CGM data is unchanged ("+n(qe,i)+"+"+n(e.delta,i)+") for 5m w/ "+n(e.short_avgdelta,i)+" mg/dL ~15m change & "+n(e.long_avgdelta,2)+" mg/dL ~45m change"),console.error("Simulator mode detected ("+e.device+"): continuing anyway")):!0),Pe>12||Pe<-5?Ge.reason="If current system time "+Ie+" is correct, then BG data is too old. The last BG data was read "+Pe+"m ago at "+Fe:0===e.short_avgdelta&&0===e.long_avgdelta&&(e.last_cal&&e.last_cal<3?Ge.reason="CGM was just calibrated":Ge.reason="CGM data is unchanged ("+n(qe,i)+"+"+n(e.delta,i)+") for 5m w/ "+n(e.short_avgdelta,i)+" mg/dL ~15m change & "+n(e.long_avgdelta,i)+" mg/dL ~45m change"),qe<=10||38===qe||We>=3||Pe>12||Pe<-5||0===e.short_avgdelta&&0===e.long_avgdelta)return t.rate>=Ae?(Ge.reason+=". Canceling high temp basal of "+t.rate,Ge.deliverAt=Re,Ge.temp="absolute",Ge.duration=0,Ge.rate=0,Ge):0===t.rate&&t.duration>30?(Ge.reason+=". Shortening "+t.duration+"m long zero temp to 30m. ",Ge.deliverAt=Re,Ge.temp="absolute",Ge.duration=30,Ge.rate=0,Ge):(Ge.reason+=". Temp "+t.rate+" <= current basal "+Ae+"U/hr; doing nothing. ",Ge);var ze,Ne,Ze,He,$e=i.max_iob;if(void 0!==i.min_bg&&(Ne=i.min_bg),void 0!==i.max_bg&&(Ze=i.max_bg),void 0!==i.enableSMB_high_bg_target&&(He=i.enableSMB_high_bg_target),void 0===i.min_bg||void 0===i.max_bg)return Ge.error="Error: could not determine target_bg. ",Ge;ze=(i.min_bg+i.max_bg)/2;var Je=i.exercise_mode||i.high_temptarget_raises_sensitivity||f.isEnabled,Ke=100,Qe=160;if(i.half_basal_exercise_target&&(Qe=i.half_basal_exercise_target),Je&&i.temptargetSet&&ze>Ke||i.low_temptarget_lowers_sensitivity&&i.temptargetSet&&ze<Ke){var Ve=Qe-Ke;sensitivityRatio=Ve*(Ve+ze-Ke)<=0?i.autosens_max:Ve/(Ve+ze-Ke),sensitivityRatio=Math.min(sensitivityRatio,i.autosens_max),sensitivityRatio=o(sensitivityRatio,2),process.stderr.write("Sensitivity ratio set to "+sensitivityRatio+" based on temp target of "+ze+"; ")}else void 0!==s&&s&&(sensitivityRatio=s.ratio,process.stderr.write("Autosens ratio: "+sensitivityRatio+"; "));if(i.temptargetSet&&ze<Ke&&Y&&X>=ze&&sensitivityRatio<_e&&(s.ratio=_e*(Ke/ze),s.ratio=Math.min(s.ratio,i.autosens_max),sensitivityRatio=o(s.ratio,2),console.log("Dynamic ratio increased from "+o(_e,2)+" to "+o(s.ratio,2)+" due to a low temp target ("+ze+").")),sensitivityRatio&&!Y?(Ae=i.current_basal*sensitivityRatio,Ae=r(Ae,i)):Y&&i.tddAdjBasal&&(Ae=i.current_basal*se,Ae=r(Ae,i),process.stderr.write("TDD-adjustment of basals activated, using tdd24h_14d_Ratio "+o(se,2)+", TDD 24h = "+o(Q,2)+"U, Weighted average TDD = "+o(G,2)+"U, (Weight percentage = "+R+"), Total data of TDDs (up to 14 days) average = "+o(O,2)+"U. "),Ae!==Oe?process.stderr.write("Adjusting basal from "+Oe+" U/h to "+Ae+" U/h; "):process.stderr.write("Basal unchanged: "+Ae+" U/h; ")),i.temptargetSet);else if(void 0!==s&&s&&(i.sensitivity_raises_target&&s.ratio<1||i.resistance_lowers_target&&s.ratio>1)){Ne=o((Ne-60)/s.ratio)+60,Ze=o((Ze-60)/s.ratio)+60;var Xe=o((ze-60)/s.ratio)+60;ze===(Xe=Math.max(80,Xe))?process.stderr.write("target_bg unchanged: "+Xe+"; "):process.stderr.write("target_bg from "+ze+" to "+Xe+"; "),ze=Xe}var Ye=200,et=200,tt=200;if(e.noise>=2){var at=Math.max(1.1,i.noisyCGMTargetMultiplier);Math.min(250,i.maxRaw);Ye=o(Math.min(200,Ne*at)),et=o(Math.min(200,ze*at)),tt=o(Math.min(200,Ze*at)),process.stderr.write("Raising target_bg for noisy / raw CGM data, from "+ze+" to "+et+"; "),Ne=Ye,ze=et,Ze=tt}var rt=Ne-.5*(Ne-40),ot=i.threshold_setting;ot>rt&&ot<=120&&ot>=65?(console.error("Threshold changed in settings from "+n(rt,i)+" to "+n(ot,i)+". "),rt=ot):console.error("Current threshold: "+n(rt,i));var nt="",it=o(i.sens,1),st=i.sens;if(void 0!==s&&s&&((st=o(st=i.sens/sensitivityRatio,1))!==it?process.stderr.write("ISF from "+n(it,i)+" to "+n(st,i)):process.stderr.write("ISF unchanged: "+n(st,i)),nt+="Autosens ratio: "+o(sensitivityRatio,2)+", ISF: "+n(it,i)+"→"+n(st,i)),console.error("CR:"+i.carb_ratio),void 0===a)return Ge.error="Error: iob_data undefined. ",Ge;var lt,mt=a;if(a.length,a.length>1&&(a=mt[0]),void 0===a.activity||void 0===a.iob)return Ge.error="Error: iob_data missing some property. ",Ge;var ut=((lt=void 0!==a.lastTemp?o((new Date(Ie).getTime()-a.lastTemp.date)/6e4):0)+t.duration)%30;if(console.error("currenttemp:"+t.rate+" lastTempAge:"+lt+"m, tempModulus:"+ut+"m"),Ge.temp="absolute",Ge.deliverAt=Re,u&&t&&a.lastTemp&&t.rate!==a.lastTemp.rate&&lt>10&&t.duration)return Ge.reason="Warning: currenttemp rate "+t.rate+" != lastTemp rate "+a.lastTemp.rate+" from pumphistory; canceling temp",m.setTempBasal(0,0,i,Ge,t);if(t&&a.lastTemp&&t.duration>0){var dt=lt-a.lastTemp.duration;if(dt>5&&lt>10)return Ge.reason="Warning: currenttemp running but lastTemp from pumphistory ended "+dt+"m ago; canceling temp",m.setTempBasal(0,0,i,Ge,t)}var ct=o(-a.activity*st*5,2),gt=o(6*(Ee-ct));gt<0&&(gt=o(6*(ke-ct)))<0&&(gt=o(6*(e.long_avgdelta-ct)));var ht=qe,pt=(ht=a.iob>0?o(qe-a.iob*st):o(qe-a.iob*Math.min(st,i.sens)))+gt;if(void 0===pt||isNaN(pt))return Ge.error="Error: could not calculate eventualBG. Sensitivity: "+st+" Deviation: "+gt,Ge;var ft=function(e,t,a){return o(a+(e-t)/24,1)}(ze,pt,ct);Ge={temp:"absolute",bg:qe,tick:je,eventualBG:pt,insulinReq:0,reservoir:d,deliverAt:Re,sensitivityRatio,TDD:Q,insulin:V,current_target:ze};var bt=[],vt=[],Bt=[],Mt=[];bt.push(qe),vt.push(qe),Mt.push(qe),Bt.push(qe);var _t=function(e,t,a,r,o,i){return t?!e.allowSMB_with_high_temptarget&&e.temptargetSet&&o>100?(console.error("SMB disabled due to high temptarget of "+o),!1):!0===a.bwFound&&!1===e.A52_risk_enable?(console.error("SMB disabled due to Bolus Wizard activity in the last 6 hours."),!1):!0===e.enableSMB_always?(a.bwFound?console.error("Warning: SMB enabled within 6h of using Bolus Wizard: be sure to easy bolus 30s before using Bolus Wizard"):console.error("SMB enabled due to enableSMB_always"),!0):!0===e.enableSMB_with_COB&&a.mealCOB?(a.bwCarbs?console.error("Warning: SMB enabled with Bolus Wizard carbs: be sure to easy bolus 30s before using Bolus Wizard"):console.error("SMB enabled for COB of "+a.mealCOB),!0):!0===e.enableSMB_after_carbs&&a.carbs?(a.bwCarbs?console.error("Warning: SMB enabled with Bolus Wizard carbs: be sure to easy bolus 30s before using Bolus Wizard"):console.error("SMB enabled for 6h after carb entry"),!0):!0===e.enableSMB_with_temptarget&&e.temptargetSet&&o<100?(a.bwFound?console.error("Warning: SMB enabled within 6h of using Bolus Wizard: be sure to easy bolus 30s before using Bolus Wizard"):console.error("SMB enabled for temptarget of "+n(o,e)),!0):!0===e.enableSMB_high_bg&&null!==i&&r>=i?(console.error("Checking BG to see if High for SMB enablement."),console.error("Current BG",r," | High BG ",i),a.bwFound?console.error("Warning: High BG SMB enabled within 6h of using Bolus Wizard: be sure to easy bolus 30s before using Bolus Wizard"):console.error("High BG detected. Enabling SMB."),!0):(console.error("SMB disabled (no enableSMB preferences active or no condition satisfied)"),!1):(console.error("SMB disabled (!microBolusAllowed)"),!1)}(i,u,l,qe,ze,He),yt=i.enableUAM,xt=0,wt=0;xt=o(Ee-ct,1);var Dt=o(Ee-ct,1);csf=st/i.carb_ratio,console.error("profile.sens:"+n(i.sens,i)+", sens:"+n(st,i)+", CSF:"+o(csf,1));var St=o(30*csf*5/60,1);xt>St&&(console.error("Limiting carb impact from "+xt+" to "+St+"mg/dL/5m (30g/h)"),xt=St);var Tt=3;sensitivityRatio&&(Tt/=sensitivityRatio);var Ct=Tt;if(l.carbs){Tt=Math.max(Tt,l.mealCOB/20);var Ut=o((new Date(Ie).getTime()-l.lastCarbTime)/6e4),Gt=(l.carbs-l.mealCOB)/l.carbs;Ct=o(Ct=Tt+1.5*Ut/60,1),console.error("Last carbs "+Ut+" minutes ago; remainingCATime:"+Ct+"hours; "+o(100*Gt,1)+"% carbs absorbed")}var Rt=Math.max(0,xt/5*60*Ct/2)/csf,Ot=90,At=1;i.remainingCarbsCap&&(Ot=Math.min(90,i.remainingCarbsCap)),i.remainingCarbsFraction&&(At=Math.min(1,i.remainingCarbsFraction));var It=1-At,jt=Math.max(0,l.mealCOB-Rt-l.carbs*It),Ft=(jt=Math.min(Ot,jt))*csf*5/60/(Ct/2),Pt=o(l.slopeFromMaxDeviation,2),qt=o(l.slopeFromMinDeviation,2),Wt=Math.min(Pt,-qt/3);wt=0===xt?0:Math.min(60*Ct/5/2,Math.max(0,l.mealCOB*csf/xt)),console.error("Carb Impact:"+xt+"mg/dL per 5m; CI Duration:"+o(5*wt/60*2,1)+"hours; remaining CI ("+Ct/2+"h peak):"+o(Ft,1)+"mg/dL per 5m");var Et,kt,Lt,zt,Nt,Zt=999,Ht=999,$t=999,Jt=qe,Kt=999,Qt=999,Vt=999,Xt=999,Yt=pt,ea=qe,ta=qe,aa=0,ra=[],oa=[];try{mt.forEach((function(e){var t=o(-e.activity*st*5,2),a=o(-e.iobWithZeroTemp.activity*st*5,2),r=ht,n=xt*(1-Math.min(1,vt.length/12));if(!0===(Y&&!Be))Yt=vt[vt.length-1]+o(-e.activity*(1800/(D*re*Math.log(Math.max(vt[vt.length-1],39)/be+1)))*5,2)+n,r=Mt[Mt.length-1]+o(-e.iobWithZeroTemp.activity*(1800/(D*re*Math.log(Math.max(Mt[Mt.length-1],39)/be+1)))*5,2),console.log("Dynamic ISF (Logarithmic Formula) )adjusted predictions for IOB and ZT: IOBpredBG: "+o(Yt,2)+" , ZTpredBG: "+o(r,2));else Yt=vt[vt.length-1]+t+n,r=Mt[Mt.length-1]+a;var i=Math.max(0,Math.max(0,xt)*(1-bt.length/Math.max(2*wt,1))),s=Math.min(bt.length,12*Ct-bt.length),l=Math.max(0,s/(Ct/2*12)*Ft);i+l,ra.push(o(l,0)),oa.push(o(i,0)),COBpredBG=bt[bt.length-1]+t+Math.min(0,n)+i+l;var m=Math.max(0,Dt+Bt.length*Wt),u=Math.max(0,Dt*(1-Bt.length/Math.max(36,1))),d=Math.min(m,u);if(d>0&&(aa=o(5*(Bt.length+1)/60,1)),!0===(Y&&!Be))UAMpredBG=Bt[Bt.length-1]+o(-e.activity*(1800/(D*re*Math.log(Math.max(Bt[Bt.length-1],39)/be+1)))*5,2)+Math.min(0,n)+d,console.log("Dynamic ISF (Logarithmic Formula) adjusted prediction for UAM: UAMpredBG: "+o(UAMpredBG,2));else UAMpredBG=Bt[Bt.length-1]+t+Math.min(0,n)+d;vt.length<48&&vt.push(Yt),bt.length<48&&bt.push(COBpredBG),Bt.length<48&&Bt.push(UAMpredBG),Mt.length<48&&Mt.push(r),COBpredBG<Kt&&(Kt=o(COBpredBG)),UAMpredBG<Qt&&(Qt=o(UAMpredBG)),Yt<Vt&&(Vt=o(Yt)),r<Xt&&(Xt=o(r));vt.length>18&&Yt<Zt&&(Zt=o(Yt)),Yt>ea&&(ea=Yt),(wt||Ft>0)&&bt.length>18&&COBpredBG<Ht&&(Ht=o(COBpredBG)),(wt||Ft>0)&&COBpredBG>ea&&(ta=COBpredBG),yt&&Bt.length>12&&UAMpredBG<$t&&($t=o(UAMpredBG)),yt&&UAMpredBG>ea&&UAMpredBG}))}catch(e){console.error("Problem with iobArray.  Optional feature Advanced Meal Assist disabled")}l.mealCOB&&(console.error("predCIs (mg/dL/5m):"+oa.join(" ")),console.error("remainingCIs:      "+ra.join(" "))),Ge.predBGs={},vt.forEach((function(e,t,a){a[t]=o(Math.min(401,Math.max(39,e)))}));for(var na=vt.length-1;na>12&&vt[na-1]===vt[na];na--)vt.pop();for(Ge.predBGs.IOB=vt,Lt=o(vt[vt.length-1]),Mt.forEach((function(e,t,a){a[t]=o(Math.min(401,Math.max(39,e)))})),na=Mt.length-1;na>6&&!(Mt[na-1]>=Mt[na]||Mt[na]<=ze);na--)Mt.pop();if(Ge.predBGs.ZT=Mt,o(Mt[Mt.length-1]),l.mealCOB>0&&(xt>0||Ft>0)){for(bt.forEach((function(e,t,a){a[t]=o(Math.min(401,Math.max(39,e)))})),na=bt.length-1;na>12&&bt[na-1]===bt[na];na--)bt.pop();Ge.predBGs.COB=bt,zt=o(bt[bt.length-1]),pt=Math.max(pt,o(bt[bt.length-1]))}if(xt>0||Ft>0){if(yt){for(Bt.forEach((function(e,t,a){a[t]=o(Math.min(401,Math.max(39,e)))})),na=Bt.length-1;na>12&&Bt[na-1]===Bt[na];na--)Bt.pop();Ge.predBGs.UAM=Bt,Nt=o(Bt[Bt.length-1]),Bt[Bt.length-1]&&(pt=Math.max(pt,o(Bt[Bt.length-1])))}Ge.eventualBG=pt}console.error("UAM Impact:"+Dt+"mg/dL per 5m; UAM Duration:"+aa+"hours"),Zt=Math.max(39,Zt),Ht=Math.max(39,Ht),$t=Math.max(39,$t),Et=o(Zt);var ia=l.mealCOB/l.carbs;kt=o($t<999&&Ht<999?(1-ia)*UAMpredBG+ia*COBpredBG:Ht<999?(Yt+COBpredBG)/2:$t<999?(Yt+UAMpredBG)/2:Yt),Xt>kt&&(kt=Xt),Jt=o(Jt=wt||Ft>0?yt?ia*Kt+(1-ia)*Qt:Kt:yt?Qt:Vt);var sa=$t;if(Xt<rt)sa=($t+Xt)/2;else if(Xt<ze){var la=(Xt-rt)/(ze-rt);sa=($t+($t*la+Xt*(1-la)))/2}else Xt>$t&&(sa=($t+Xt)/2);if(sa=o(sa),l.carbs)if(!yt&&Ht<999)Et=o(Math.max(Zt,Ht));else if(Ht<999){var ma=ia*Ht+(1-ia)*sa;Et=o(Math.max(Zt,Ht,ma))}else Et=yt?sa:Jt;else yt&&(Et=o(Math.max(Zt,sa)));Et=Math.min(Et,kt),process.stderr.write("minPredBG: "+Et+" minIOBPredBG: "+Zt+" minZTGuardBG: "+Xt),Ht<999&&process.stderr.write(" minCOBPredBG: "+Ht),$t<999&&process.stderr.write(" minUAMPredBG: "+$t),console.error(" avgPredBG:"+kt+" COB/Carbs:"+l.mealCOB+"/"+l.carbs),ta>qe&&(Et=Math.min(Et,ta)),Ge.COB=l.mealCOB,Ge.IOB=a.iob,Ge.BGI=n(ct,i),Ge.deviation=n(gt,i),Ge.ISF=n(st,i),Ge.CR=o(i.carb_ratio,1),Ge.target_bg=n(ze,i),Ge.TDD=o(Q,2),Ge.current_target=o(ze,0);var ua=Ge.CR;De!=Ge.CR&&(ua=De+"→"+Ge.CR);var da=Ge.target_bg;ze!=b&&(da=n(b,i)+"→"+Ge.target_bg),Ge.reason=nt+", COB: "+Ge.COB+", Dev: "+Ge.deviation+", BGI: "+Ge.BGI+", CR: "+ua+", Target: "+da+", minPredBG "+n(Et,i)+", minGuardBG "+n(Jt,i)+", IOBpredBG "+n(Lt,i),zt>0&&(Ge.reason+=", COBpredBG "+n(zt,i)),Nt>0&&(Ge.reason+=", UAMpredBG "+n(Nt,i)),Ge.reason+=tddReason+ye,Ge.reason+="; ";var ca=ht;ca<40&&(ca=Math.min(Jt,ca));var ga,ha=rt-ca,pa=240,fa=240;if(l.mealCOB>0&&(xt>0||Ft>0)){for(na=0;na<bt.length;na++)if(bt[na]<Ne){pa=5*na;break}for(na=0;na<bt.length;na++)if(bt[na]<rt){fa=5*na;break}}else{for(na=0;na<vt.length;na++)if(vt[na]<Ne){pa=5*na;break}for(na=0;na<vt.length;na++)if(vt[na]<rt){fa=5*na;break}}_t&&Jt<rt&&(console.error("minGuardBG "+n(Jt,i)+" projected below "+n(rt,i)+" - disabling SMB"),_t=!1),void 0===i.maxDelta_bg_threshold&&(ga=.2),void 0!==i.maxDelta_bg_threshold&&(ga=Math.min(i.maxDelta_bg_threshold,.4)),Le>ga*qe&&(console.error("maxDelta "+n(Le,i)+" > "+100*ga+"% of BG "+n(qe,i)+" - disabling SMB"),Ge.reason+="maxDelta "+n(Le,i)+" > "+100*ga+"% of BG "+n(qe,i)+" - SMB disabled!, ",_t=!1),console.error("BG projected to remain above "+n(Ne,i)+" for "+pa+"minutes"),(fa<240||pa<60)&&console.error("BG projected to remain above "+n(rt,i)+" for "+fa+"minutes");var ba=fa,va=i.current_basal*st*ba/60,Ba=Math.max(0,l.mealCOB-.25*l.carbs),Ma=(ha-va)/csf-Ba;va=o(va),Ma=o(Ma),console.error("naive_eventualBG:",ht,"bgUndershoot:",ha,"zeroTempDuration:",ba,"zeroTempEffect:",va,"carbsReq:",Ma),"Could not parse clock data"==l.reason?console.error("carbsReq unknown: Could not parse clock data"):Ma>=i.carbsReqThreshold&&fa<=45&&(Ge.carbsReq=Ma,Ge.reason+=Ma+" add'l carbs req w/in "+fa+"m; ");var _a=0;if(qe<rt&&a.iob<20*-i.current_basal/60&&Ee>0&&Ee>ft)Ge.reason+="IOB "+a.iob+" < "+o(20*-i.current_basal/60,2),Ge.reason+=" and minDelta "+n(Ee,i)+" > expectedDelta "+n(ft,i)+"; ";else if(qe<rt||Jt<rt)return Ge.reason+="minGuardBG "+n(Jt,i)+"<"+n(rt,i),_a=o(60*((ha=ze-Jt)/st)/i.current_basal),_a=30*o(_a/30),_a=Math.min(120,Math.max(30,_a)),m.setTempBasal(0,_a,i,Ge,t);if(i.skip_neutral_temps&&Ge.deliverAt.getMinutes()>=55)return Ge.reason+="; Canceling temp at "+Ge.deliverAt.getMinutes()+"m past the hour. ",m.setTempBasal(0,0,i,Ge,t);var ya=0,xa=Ae;if(pt<Ne){if(Ge.reason+="Eventual BG "+n(pt,i)+" < "+n(Ne,i),Ee>ft&&Ee>0&&!Ma)return ht<40?(Ge.reason+=", naive_eventualBG < 40. ",m.setTempBasal(0,30,i,Ge,t)):(e.delta>Ee?Ge.reason+=", but Delta "+n(je,i)+" > expectedDelta "+n(ft,i):Ge.reason+=", but Min. Delta "+Ee.toFixed(2)+" > Exp. Delta "+n(ft,i),t.duration>15&&r(Ae,i)===r(t.rate,i)?(Ge.reason+=", temp "+t.rate+" ~ req "+Ae+"U/hr. ",Ge):(Ge.reason+="; setting current basal of "+Ae+" as temp. ",m.setTempBasal(Ae,30,i,Ge,t)));ya=o(ya=2*Math.min(0,(pt-ze)/st),2);var wa=Math.min(0,(ht-ze)/st);if(wa=o(wa,2),Ee<0&&Ee>ft)ya=o(ya*(Ee/ft),2);if(xa=r(xa=Ae+2*ya,i),t.duration*(t.rate-Ae)/60<Math.min(ya,wa)-.3*Ae)return Ge.reason+=", "+t.duration+"m@"+t.rate.toFixed(2)+" is a lot less than needed. ",m.setTempBasal(xa,30,i,Ge,t);if(void 0!==t.rate&&t.duration>5&&xa>=.8*t.rate)return Ge.reason+=", temp "+t.rate+" ~< req "+xa+"U/hr. ",Ge;if(xa<=0){if((_a=o(60*((ha=ze-ht)/st)/i.current_basal))<0?_a=0:(_a=30*o(_a/30),_a=Math.min(120,Math.max(0,_a))),_a>0)return Ge.reason+=", setting "+_a+"m zero temp. ",m.setTempBasal(xa,_a,i,Ge,t)}else Ge.reason+=", setting "+xa+"U/hr. ";return m.setTempBasal(xa,30,i,Ge,t)}if(Ee<ft&&(!u||!_t))return e.delta<Ee?Ge.reason+="Eventual BG "+n(pt,i)+" > "+n(Ne,i)+" but Delta "+n(je,i)+" < Exp. Delta "+n(ft,i):Ge.reason+="Eventual BG "+n(pt,i)+" > "+n(Ne,i)+" but Min. Delta "+Ee.toFixed(2)+" < Exp. Delta "+n(ft,i),t.duration>15&&r(Ae,i)===r(t.rate,i)?(Ge.reason+=", temp "+t.rate+" ~ req "+Ae+"U/hr. ",Ge):(Ge.reason+="; setting current basal of "+Ae+" as temp. ",m.setTempBasal(Ae,30,i,Ge,t));if(Math.min(pt,Et)<Ze&&(!u||!_t))return Ge.reason+=n(pt,i)+"-"+n(Et,i)+" in range: no temp required",t.duration>15&&r(Ae,i)===r(t.rate,i)?(Ge.reason+=", temp "+t.rate+" ~ req "+Ae+"U/hr. ",Ge):(Ge.reason+="; setting current basal of "+Ae+" as temp. ",m.setTempBasal(Ae,30,i,Ge,t));if(pt>=Ze&&(Ge.reason+="Eventual BG "+n(pt,i)+" >= "+n(Ze,i)+", "),a.iob>$e)return Ge.reason+="IOB "+o(a.iob,2)+" > max_iob "+$e,t.duration>15&&r(Ae,i)===r(t.rate,i)?(Ge.reason+=", temp "+t.rate+" ~ req "+Ae+"U/hr. ",Ge):(Ge.reason+="; setting current basal of "+Ae+" as temp. ",m.setTempBasal(Ae,30,i,Ge,t));(ya=o((Math.min(Et,pt)-ze)/st,2))>$e-a.iob?(console.error("SMB limited by maxIOB: "+$e-a.iob+" (. insulinReq: "+ya+" U)"),Ge.reason+="max_iob "+$e+", ",ya=$e-a.iob):console.error("SMB not limited by maxIOB ( insulinReq: "+ya+" U)."),xa=r(xa=Ae+2*ya,i),ya=o(ya,3),Ge.insulinReq=ya;var Da=o((new Date(Ie).getTime()-a.lastBolusTime)/6e4,1);if(u&&_t&&qe>rt){var Sa=o(l.mealCOB/i.carb_ratio,3),Ta=0;void 0===i.maxSMBBasalMinutes?(Ta=o(30*i.current_basal/60,1),console.error("profile.maxSMBBasalMinutes undefined: defaulting to 30m"),ya>Ta&&console.error("SMB limited by maxBolus: "+Ta+" ( "+ya+" U)")):a.iob>Sa&&a.iob>0?(console.error("IOB"+a.iob+"> COB"+l.mealCOB+"; mealInsulinReq ="+Sa),i.maxUAMSMBBasalMinutes?(console.error("profile.maxUAMSMBBasalMinutes: "+i.maxUAMSMBBasalMinutes+", profile.current_basal: "+i.current_basal),Ta=o(i.current_basal*i.maxUAMSMBBasalMinutes/60,1)):(console.error("profile.maxUAMSMBBasalMinutes undefined: defaulting to 30m"),Ta=o(30*i.current_basal/60,1)),ya>Ta?console.error("SMB limited by maxUAMSMBBasalMinutes [ "+i.maxUAMSMBBasalMinutes+"m ]: "+Ta+"U ( "+ya+"U )"):console.error("SMB is not limited by maxUAMSMBBasalMinutes. ( insulinReq: "+ya+"U )")):(console.error("profile.maxSMBBasalMinutes: "+i.maxSMBBasalMinutes+", profile.current_basal: "+i.current_basal),ya>(Ta=o(i.current_basal*i.maxSMBBasalMinutes/60,1))?console.error("SMB limited by maxSMBBasalMinutes: "+i.maxSMBBasalMinutes+"m ]: "+Ta+"U ( insulinReq: "+ya+"U )"):console.error("SMB is not limited by maxSMBBasalMinutes. ( insulinReq: "+ya+"U )"));var Ca=i.bolus_increment,Ua=1/Ca,Ga=i.smb_delivery_ratio;Ga>.5&&console.error("SMB Delivery Ratio increased from default 0.5 to "+o(Ga,2));var Ra=Math.min(ya*Ga,Ta);Ra=Math.floor(Ra*Ua)/Ua,_a=o(60*((ze-(ht+Zt)/2)/st)/i.current_basal),ya>0&&Ra<Ca&&(_a=0);var Oa=0;_a<=0?_a=0:_a>=30?(_a=30*o(_a/30),_a=Math.min(60,Math.max(0,_a))):(Oa=o(Ae*_a/30,2),_a=30),Ge.reason+=" insulinReq "+ya,Ra>=Ta&&(Ge.reason+="; maxBolus "+Ta),_a>0&&(Ge.reason+="; setting "+_a+"m low temp of "+Oa+"U/h"),Ge.reason+=". ";var Aa=3;i.SMBInterval&&(Aa=Math.min(10,Math.max(1,i.SMBInterval)));var Ia=o(Aa-Da,0),ja=o(60*(Aa-Da),0)%60;if(console.error("naive_eventualBG "+ht+","+_a+"m "+Oa+"U/h temp needed; last bolus "+Da+"m ago; maxBolus: "+Ta),Da>Aa?Ra>0&&(Ge.units=Ra,Ge.reason+="Microbolusing "+Ra+"U. "):Ge.reason+="Waiting "+Ia+"m "+ja+"s to microbolus again. ",_a>0)return Ge.rate=Oa,Ge.duration=_a,Ge}var Fa=m.getMaxSafeBasal(i);return xa>Fa&&(Ge.reason+="adj. req. rate: "+xa+" to maxSafeBasal: "+o(Fa,2)+", ",xa=r(Fa,i)),t.duration*(t.rate-Ae)/60>=2*ya?(Ge.reason+=t.duration+"m@"+t.rate.toFixed(2)+" > 2 * insulinReq. Setting temp basal of "+xa+"U/hr. ",m.setTempBasal(xa,30,i,Ge,t)):void 0===t.duration||0===t.duration?(Ge.reason+="no temp, setting "+xa+"U/hr. ",m.setTempBasal(xa,30,i,Ge,t)):t.duration>5&&r(xa,i)<=r(t.rate,i)?(Ge.reason+="temp "+t.rate+" >~ req "+xa+"U/hr. ",Ge):(Ge.reason+="temp "+t.rate+"<"+xa+"U/hr. ",m.setTempBasal(xa,30,i,Ge,t))}},6880:(e,t,a)=>{var r=a(6654);e.exports=function(e,t){var a=20;void 0!==t&&"string"==typeof t.model&&(r(t.model,"54")||r(t.model,"23"))&&(a=40);return e<1?Math.round(e*a)/a:e<10?Math.round(20*e)/20:Math.round(10*e)/10}},2705:(e,t,a)=>{var r=a(5639).Symbol;e.exports=r},9932:e=>{e.exports=function(e,t){for(var a=-1,r=null==e?0:e.length,o=Array(r);++a<r;)o[a]=t(e[a],a,e);return o}},9750:e=>{e.exports=function(e,t,a){return e==e&&(void 0!==a&&(e=e<=a?e:a),void 0!==t&&(e=e>=t?e:t)),e}},4239:(e,t,a)=>{var r=a(2705),o=a(9607),n=a(2333),i=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":i&&i in Object(e)?o(e):n(e)}},531:(e,t,a)=>{var r=a(2705),o=a(9932),n=a(1469),i=a(3448),s=r?r.prototype:void 0,l=s?s.toString:void 0;e.exports=function e(t){if("string"==typeof t)return t;if(n(t))return o(t,e)+"";if(i(t))return l?l.call(t):"";var a=t+"";return"0"==a&&1/t==-Infinity?"-0":a}},7561:(e,t,a)=>{var r=a(7990),o=/^\s+/;e.exports=function(e){return e?e.slice(0,r(e)+1).replace(o,""):e}},1957:(e,t,a)=>{var r="object"==typeof a.g&&a.g&&a.g.Object===Object&&a.g;e.exports=r},9607:(e,t,a)=>{var r=a(2705),o=Object.prototype,n=o.hasOwnProperty,i=o.toString,s=r?r.toStringTag:void 0;e.exports=function(e){var t=n.call(e,s),a=e[s];try{e[s]=void 0;var r=!0}catch(e){}var o=i.call(e);return r&&(t?e[s]=a:delete e[s]),o}},2333:e=>{var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},5639:(e,t,a)=>{var r=a(1957),o="object"==typeof self&&self&&self.Object===Object&&self,n=r||o||Function("return this")();e.exports=n},7990:e=>{var t=/\s/;e.exports=function(e){for(var a=e.length;a--&&t.test(e.charAt(a)););return a}},6654:(e,t,a)=>{var r=a(9750),o=a(531),n=a(554),i=a(9833);e.exports=function(e,t,a){e=i(e),t=o(t);var s=e.length,l=a=void 0===a?s:r(n(a),0,s);return(a-=t.length)>=0&&e.slice(a,l)==t}},1469:e=>{var t=Array.isArray;e.exports=t},3218:e=>{e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},7005:e=>{e.exports=function(e){return null!=e&&"object"==typeof e}},3448:(e,t,a)=>{var r=a(4239),o=a(7005);e.exports=function(e){return"symbol"==typeof e||o(e)&&"[object Symbol]"==r(e)}},8601:(e,t,a)=>{var r=a(4841),o=1/0;e.exports=function(e){return e?(e=r(e))===o||e===-1/0?17976931348623157e292*(e<0?-1:1):e==e?e:0:0===e?e:0}},554:(e,t,a)=>{var r=a(8601);e.exports=function(e){var t=r(e),a=t%1;return t==t?a?t-a:t:0}},4841:(e,t,a)=>{var r=a(7561),o=a(3218),n=a(3448),i=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,m=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(n(e))return NaN;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=r(e);var a=s.test(e);return a||l.test(e)?m(e.slice(2),a?2:8):i.test(e)?NaN:+e}},9833:(e,t,a)=>{var r=a(531);e.exports=function(e){return null==e?"":r(e)}}},t={};function a(r){var o=t[r];if(void 0!==o)return o.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,a),n.exports}a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}();var r=a(5546);freeaps_determineBasal=r})();
