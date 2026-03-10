import{ar as o,ax as s,aw as r,bX as m}from"./Da0WttWU.js";import{u}from"./DjxeeUr6.js";const f=o({__name:"PmRun",props:{inStack:{type:Boolean,default:!1},script:{},sync:{default:"_pm"},noSync:{type:Boolean}},setup(n){const c=`
::code-group{${n.inStack?"in-stack":""} ${n.noSync?"":`sync="${n.sync}"`}}
${u().packageManagers.value.map(a=>{const e=`${a.command}${a.run}${n.script}`;return`\`\`\`bash [${a.name}]
${e}
\`\`\`
`}).join(`
`)}
::
`;return(a,e)=>{const t=m;return r(),s(t,{value:c,class:"[&:not(:first-child)]:mt-5"})}}});export{f as default};
