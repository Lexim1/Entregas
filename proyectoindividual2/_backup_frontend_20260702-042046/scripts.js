const BUSINESS_PHONE = "51943973864";
const DISPLAY_PHONE = "943 973 864";
const BUSINESS_EMAIL = "alekaren39@gmail.com";
const CART_KEY = "pinexus_cart_v3";
function readCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)) || []}catch{return []}}
function saveCart(cart){localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); renderCheckout();}
function money(value){return `S/ ${Number(value || 0).toFixed(0)}`}
function total(cart){return cart.reduce((sum,item)=>sum+Number(item.price),0)}
function itemFromCard(card){return {name:card.dataset.name, price:Number(card.dataset.price), type:card.dataset.type || "producto"}}
function addItem(item){const cart=readCart(); cart.push(item); saveCart(cart); openCart();}
function removeItem(index){const cart=readCart(); cart.splice(index,1); saveCart(cart)}
function openCart(){document.getElementById("cartPanel")?.classList.add("open");document.getElementById("cartBackdrop")?.classList.add("open")}
function closeCart(){document.getElementById("cartPanel")?.classList.remove("open");document.getElementById("cartBackdrop")?.classList.remove("open")}
function checkoutUrl(cart){return `contacto.html?pedido=${encodeURIComponent(cart.map(i=>i.name).join("\n"))}&total=${total(cart)}`}
function whatsappUrl(msg){return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(msg)}`}
function renderCart(){const cart=readCart();const count=document.getElementById("cartCount"),list=document.getElementById("cartItems"),sum=document.getElementById("cartTotal"),link=document.getElementById("checkoutLink");if(count)count.textContent=cart.length;if(sum)sum.textContent=money(total(cart));if(link)link.href=cart.length?checkoutUrl(cart):"contacto.html";if(!list)return;list.innerHTML="";if(!cart.length){list.innerHTML='<p class="empty">Tu carrito está vacío.</p>';return}cart.forEach((item,index)=>{const row=document.createElement("div");row.className="cart-row";row.innerHTML=`<div><strong>${item.name}</strong><p>${money(item.price)}</p></div><button type="button">Quitar</button>`;row.querySelector("button").addEventListener("click",()=>removeItem(index));list.appendChild(row)})}
function selectedCards(){return [...document.querySelectorAll(".product-card")].filter(card=>card.querySelector(".select-item")?.checked).map(itemFromCard)}
function renderCheckout(){const cart=readCart();const params=new URLSearchParams(location.search);const tipo=params.get("tipo");const pedidoParam=params.get("pedido");const totalParam=params.get("total");const pedido=document.getElementById("pedidoResumen");const totalInput=document.getElementById("totalPedido");const items=document.getElementById("checkoutItems");const typeSelect=document.getElementById("tipoSolicitud");const legend=document.getElementById("formLegend");if(typeSelect&&tipo)typeSelect.value=tipo==="testimonio"?"testimonio":tipo==="combo"?"combo":"compra";if(legend&&typeSelect)legend.textContent=typeSelect.value==="testimonio"?"Testimonio":typeSelect.value==="combo"?"Combo personalizado":"Pedido";if(pedido&&!pedido.value)pedido.value=cart.length?cart.map(i=>`${i.name} (${money(i.price)})`).join("\n"):(pedidoParam||"");if(totalInput)totalInput.value=cart.length?money(total(cart)):(totalParam?money(totalParam):"");if(items){if(cart.length){items.innerHTML=cart.map(i=>`<div class="cart-row"><strong>${i.name}</strong><span>${money(i.price)}</span></div>`).join("")}else if(pedidoParam){items.innerHTML=pedidoParam.split(/\n|,/).filter(Boolean).map(line=>`<div class="cart-row"><strong>${line.trim()}</strong><span>${totalParam?money(totalParam):""}</span></div>`).join("")}else{items.innerHTML='<p class="empty">Puedes escribir tu pedido o volver al catálogo.</p>'}}updateWhatsappOrder()}
function updateWhatsappOrder(){const order=document.getElementById("whatsappOrder");if(!order)return;const pedido=document.getElementById("pedidoResumen")?.value||"Pedido por confirmar";const totalValue=document.getElementById("totalPedido")?.value||"Total por confirmar";const metodo=document.getElementById("metodoPago")?.value||"Método por confirmar";const nombre=document.getElementById("nombre")?.value||"";const correo=document.getElementById("correo")?.value||"";order.href=whatsappUrl(`Hola Piñexus Streaming. Quiero realizar esta solicitud:\n${pedido}\nTotal: ${totalValue}\nMétodo: ${metodo}\nNombre: ${nombre}\nCorreo: ${correo}\nAdjuntaré mi voucher.`)}
document.addEventListener("DOMContentLoaded",()=>{document.getElementById("mobileMenuBtn")?.addEventListener("click",()=>document.getElementById("navegacion")?.classList.toggle("mostrar"));document.getElementById("cartFloat")?.addEventListener("click",openCart);document.getElementById("closeCart")?.addEventListener("click",closeCart);document.getElementById("cartBackdrop")?.addEventListener("click",closeCart);document.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>addItem(itemFromCard(btn.closest(".product-card")))));document.querySelectorAll(".add-direct").forEach(btn=>btn.addEventListener("click",()=>addItem({name:btn.dataset.name,price:Number(btn.dataset.price),type:"combo"})));document.getElementById("buySelected")?.addEventListener("click",()=>{const items=selectedCards();if(!items.length){openCart();return}saveCart(items);location.href=checkoutUrl(items)});const search=document.getElementById("searchInput"),filter=document.getElementById("categoryFilter");function filterCatalog(){const term=(search?.value||"").toLowerCase();const cat=filter?.value||"todos";document.querySelectorAll(".product-card[data-category]").forEach(card=>{const haystack=`${card.dataset.name} ${card.dataset.category} ${card.innerText}`.toLowerCase();const okCat=cat==="todos"||card.dataset.type===cat||(card.dataset.category||"").includes(cat);const okTerm=!term||haystack.includes(term);card.classList.toggle("hidden",!(okCat&&okTerm))})}search?.addEventListener("input",filterCatalog);filter?.addEventListener("change",filterCatalog);document.getElementById("clearCart")?.addEventListener("click",()=>saveCart([]));["pedidoResumen","totalPedido","metodoPago","nombre","correo","tipoSolicitud"].forEach(id=>document.getElementById(id)?.addEventListener("input",updateWhatsappOrder));document.getElementById("tipoSolicitud")?.addEventListener("change",renderCheckout);document.getElementById("purchaseForm")?.addEventListener("submit",event=>{event.preventDefault();document.getElementById("formNote").textContent="Solicitud preparada. Envíala por WhatsApp y adjunta tu voucher.";updateWhatsappOrder()});document.getElementById("supportForm")?.addEventListener("submit",event=>{event.preventDefault();const s=document.getElementById("servicioSoporte").value;const p=document.getElementById("problema").value;const d=document.getElementById("detalleSoporte").value;document.getElementById("supportWhatsapp").href=whatsappUrl(`Hola Piñexus Streaming. Necesito soporte.\nServicio: ${s}\nProblema: ${p}\nDetalle: ${d}\nAdjuntaré captura si corresponde.`);document.getElementById("supportNote").textContent="Soporte preparado. Envíalo por WhatsApp con tu captura."});initAuth();renderCart();renderCheckout()});

/* =================================================================
   AUTENTICACIÓN (registro / login / sesión / dashboard)
   Ahora mismo se guarda todo en localStorage a modo de demo funcional.
   Cuando conectes Spring Boot + base de datos, reemplaza las 3 funciones
   marcadas con "TODO(Spring)" por llamadas fetch() a tu API real y deja
   el resto (tabs, validaciones, render del panel) tal cual.
   ================================================================= */
const USERS_KEY = "pinexus_users_v1";
const SESSION_KEY = "pinexus_session_v1";

function readUsers(){try{return JSON.parse(localStorage.getItem(USERS_KEY)) || []}catch{return []}}
function saveUsers(users){localStorage.setItem(USERS_KEY, JSON.stringify(users))}
function normalizeId(value){return (value || "").trim().toLowerCase()}
function findUserByIdentifier(identifier){const id = normalizeId(identifier); return readUsers().find(u => normalizeId(u.correo) === id || normalizeId(u.telefono) === id)}
/* Hash simple solo para no guardar la contraseña en texto plano en esta demo.
   No reemplaza un hash real (BCrypt, etc.) que debe hacerse en el backend. */
function simpleHash(str){let hash = 0; for(let i = 0; i < str.length; i++){hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0} return String(hash)}
function getSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY))}catch{return null}}
function setSession(user){localStorage.setItem(SESSION_KEY, JSON.stringify({id:user.id, nombre:user.nombre, correo:user.correo, telefono:user.telefono, loginAt:new Date().toISOString()}))}
function clearSession(){localStorage.removeItem(SESSION_KEY)}

function registerUser({nombre, correo, telefono, password}){
    const users = readUsers();
    if(users.some(u => normalizeId(u.correo) === normalizeId(correo))) return {ok:false, error:"Ya existe una cuenta registrada con ese correo."};
    if(users.some(u => normalizeId(u.telefono) === normalizeId(telefono))) return {ok:false, error:"Ya existe una cuenta registrada con ese teléfono."};
    const user = {id:Date.now(), nombre:nombre.trim(), correo:correo.trim(), telefono:telefono.trim(), passwordHash:simpleHash(password), createdAt:new Date().toISOString()};
    users.push(user);
    saveUsers(users);
    /* TODO(Spring): reemplazar por
       await fetch('/api/auth/register', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({nombre, correo, telefono, password})}) */
    return {ok:true, user};
}

function loginUser({identifier, password}){
    const user = findUserByIdentifier(identifier);
    if(!user) return {ok:false, error:"No encontramos una cuenta con ese correo o teléfono."};
    if(user.passwordHash !== simpleHash(password)) return {ok:false, error:"Contraseña incorrecta."};
    /* TODO(Spring): reemplazar por
       await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({identifier, password})}) */
    return {ok:true, user};
}

function renderAccountView(){
    const authCard = document.getElementById("authCard");
    const clientPanel = document.getElementById("clientPanel");
    if(!authCard || !clientPanel) return;
    const session = getSession();
    if(session){
        authCard.classList.add("hidden");
        clientPanel.classList.remove("hidden");
        const greeting = document.getElementById("clientGreeting");
        if(greeting) greeting.textContent = `Hola, ${session.nombre.split(" ")[0]}`;
    } else {
        authCard.classList.remove("hidden");
        clientPanel.classList.add("hidden");
    }
}

function setAuthNote(id, message, type){
    const note = document.getElementById(id);
    if(!note) return;
    note.textContent = message || "";
    note.classList.remove("error", "success");
    if(type) note.classList.add(type);
}

function initAuth(){
    if(!document.getElementById("authCard")) return; // solo corre en login.html

    document.querySelectorAll(".auth-tab").forEach(tab => tab.addEventListener("click", () => {
        document.querySelectorAll(".auth-tab").forEach(t => {t.classList.remove("active"); t.setAttribute("aria-selected","false")});
        tab.classList.add("active");
        tab.setAttribute("aria-selected","true");
        const target = tab.dataset.tab;
        document.querySelectorAll(".auth-panel").forEach(panel => panel.classList.toggle("hidden", panel.dataset.panel !== target));
    }));

    document.querySelectorAll(".toggle-pass").forEach(btn => btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        if(!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.textContent = show ? "Ocultar" : "Mostrar";
    }));

    document.getElementById("loginForm")?.addEventListener("submit", event => {
        event.preventDefault();
        const identifier = document.getElementById("loginUser").value;
        const password = document.getElementById("loginPass").value;
        if(!identifier.trim() || !password){setAuthNote("loginNote","Completa correo/teléfono y contraseña.","error"); return}
        const result = loginUser({identifier, password});
        if(!result.ok){setAuthNote("loginNote", result.error, "error"); return}
        setSession(result.user);
        setAuthNote("loginNote","¡Bienvenido de nuevo! Cargando tu panel...","success");
        renderAccountView();
    });

    document.getElementById("registerForm")?.addEventListener("submit", event => {
        event.preventDefault();
        const nombre = document.getElementById("regNombre").value;
        const correo = document.getElementById("regCorreo").value;
        const telefono = document.getElementById("regTelefono").value;
        const password = document.getElementById("regPass").value;
        const password2 = document.getElementById("regPass2").value;
        const terms = document.getElementById("regTerms").checked;
        if(!nombre.trim() || !correo.trim() || !telefono.trim() || !password){setAuthNote("registerNote","Completa todos los campos.","error"); return}
        if(!/^\S+@\S+\.\S+$/.test(correo)){setAuthNote("registerNote","Ingresa un correo válido.","error"); return}
        if(password.length < 6){setAuthNote("registerNote","La contraseña debe tener al menos 6 caracteres.","error"); return}
        if(password !== password2){setAuthNote("registerNote","Las contraseñas no coinciden.","error"); return}
        if(!terms){setAuthNote("registerNote","Debes aceptar el uso de tus datos para continuar.","error"); return}
        const result = registerUser({nombre, correo, telefono, password});
        if(!result.ok){setAuthNote("registerNote", result.error, "error"); return}
        setSession(result.user);
        setAuthNote("registerNote","Cuenta creada. Cargando tu panel...","success");
        renderAccountView();
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        clearSession();
        setAuthNote("loginNote","Sesión cerrada.","success");
        renderAccountView();
    });

    renderAccountView();
}