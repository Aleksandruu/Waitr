import{r as d,o as p,j as e}from"./index-EQ7WCn_a.js";import{a as m,u}from"./app.hooks-DxXljtc5.js";const x="_container_wc8qk_1",_="_notepad_wc8qk_9",h="_frame_wc8qk_24",j="_products-list_wc8qk_29",q="_product-item_wc8qk_38",N="_total_wc8qk_39",k="_price_wc8qk_48",w="_currentOrderItem_wc8qk_59",I="_line_wc8qk_69",f="_placed_wc8qk_85",t={container:x,notepad:_,frame:h,productsList:j,productItem:q,total:N,price:k,currentOrderItem:w,line:I,placed:f},v=({})=>{const{products:n,status:a,currentOrder:r}=m(s=>s.order),i=n.reduce((s,c)=>s+c.price*c.quantity,0),l=r.reduce((s,c)=>s+c.price*c.quantity,0),o=u();return d.useEffect(()=>{o(p.setStatus("checkout"))},[]),e.jsx("div",{className:t.container,children:a!=="placed"?e.jsxs("div",{className:t.notepad,children:[e.jsx("img",{className:t.frame,src:"/assets/Frame.svg",alt:""}),e.jsxs("div",{className:t.productsList,children:[r.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:t.line,children:e.jsx("span",{children:"Produse deja comandate"})}),r.map((s,c)=>e.jsxs("p",{className:t.currentOrderItem,children:[e.jsxs("span",{children:[s.name," x",s.quantity]})," ",e.jsxs("span",{className:t.price,children:[(s.price*s.quantity).toFixed(2)," lei"]})]},s.productId+c)),n.length>0&&e.jsx("div",{className:t.line,children:e.jsx("span",{children:"Produse noi"})})]}),n.map((s,c)=>e.jsxs("p",{className:t.productItem,children:[e.jsxs("span",{children:[s.name," x",s.quantity]})," ",e.jsxs("span",{className:t.price,children:[(s.price*s.quantity).toFixed(2)," lei"]})]},s.productId+c))]}),e.jsxs("p",{className:t.total,children:[e.jsx("span",{children:"Total:"})," ",e.jsxs("span",{children:[n.length===0?l.toFixed(2):i.toFixed(2)," ","lei"]})]})]}):e.jsx("div",{className:t.placed,children:e.jsx("h2",{children:"Multumim pentru comanda!"})})})},F=v;export{F as component};
