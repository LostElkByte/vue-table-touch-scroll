import{ar as t,ax as s,aw as m,bX as r}from"./DqrikGUS.js";import{u as l}from"./BVmSoGWi.js";const d=t({__name:"PmX",props:{inStack:{type:Boolean,default:!1},command:{},sync:{default:"_pm"},noSync:{type:Boolean}},setup(a){const c=`
::code-group{${a.inStack?"in-stack":""} ${a.noSync?"":`sync="${a.sync}"`}}
${l().packageManagers.value.map(n=>{const e=`${n.x}${a.command}`;return`\`\`\`bash [${n.name}]
${e}
\`\`\`
`}).join(`
`)}
::
`;return(n,e)=>{const o=r;return m(),s(o,{value:c,class:"[&:not(:first-child)]:mt-5"})}}});export{d as default};
