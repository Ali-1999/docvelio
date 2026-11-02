/* Code 128 subset B and C. Original browser-only implementation. */
(function(global){'use strict';
const widths=[
'212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212',
'112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131',
'311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321',
'112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121',
'313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111',
'314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114',
'122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212',
'124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113',
'114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];
function encode(text){
 if(!text||text.length>80)throw Error('Code 128 requires 1–80 characters.');
 if([...text].some(c=>c.charCodeAt(0)<32||c.charCodeAt(0)>126))throw Error('Code 128 supports printable ASCII text only.');
 let values=[];
 if(/^\d+$/.test(text)&&text.length%2===0){values=[105];for(let i=0;i<text.length;i+=2)values.push(Number(text.slice(i,i+2)));}
 else{values=[104];for(const c of text)values.push(c.charCodeAt(0)-32);}
 let sum=values[0];for(let i=1;i<values.length;i++)sum+=values[i]*i;
 values.push(sum%103,106);
 let bits='';
 for(const val of values){const widthsStr=widths[val];if(!widthsStr)throw Error('Unsupported Code 128 symbol');for(let i=0;i<widthsStr.length;i++)bits+=(i%2?'0':'1').repeat(Number(widthsStr[i]));}
 return {bits,text};
}
global.DocvelioCode128={encode};
})(window);
