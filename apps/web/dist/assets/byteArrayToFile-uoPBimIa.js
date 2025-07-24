const a=(t,o)=>{if(t){const e=new Uint8Array(t.data),n=new Blob([e],{type:o});return new File([n],"logo",{type:o,lastModified:Date.now()})}};export{a as b};
