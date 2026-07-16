const API_BASE = "http://localhost:8080/api";
const BUSINESS_PHONE = "51943973864";
const CART_KEY = "pinexus_cart_v3";
const SESSION_KEY = "pinexus_session_v1";

function readCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)) || []}catch{return []}}
function saveCart(cart){localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); renderCheckout();}
function money(value){return `S/ ${Number(value || 0).toFixed(0)}`}
function total(cart){return cart.reduce((sum,item)=>sum+Number(item.price),0)}
function normalizeId(value){return (value || "").trim().toLowerCase()}
function escapeHtml(value){return String(value || "").replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]))}
function itemFromCard(card){return {name:card.dataset.name, price:Number(card.dataset.price), type:card.dataset.type || "producto"}}
function addItem(item, sourceCard){const cart=readCart(); cart.push(item); saveCart(cart); if(sourceCard){sourceCard.classList.add("added");setTimeout(()=>sourceCard.classList.remove("added"),850)} showToast(`${item.name} agregado al carrito`); openCart();}
function removeItem(index){const cart=readCart(); cart.splice(index,1); saveCart(cart)}
function openCart(){document.getElementById("cartPanel")?.classList.add("open");document.getElementById("cartBackdrop")?.classList.add("open")}
function closeCart(){document.getElementById("cartPanel")?.classList.remove("open");document.getElementById("cartBackdrop")?.classList.remove("open")}
function checkoutUrl(cart){return `contacto.html?pedido=${encodeURIComponent(cart.map(i=>i.name).join("\n"))}&total=${total(cart)}`}
function whatsappUrl(msg){return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(msg)}`}
function showToast(message){
    let toast=document.getElementById("toastMessage");
    if(!toast){
        toast=document.createElement("div");
        toast.id="toastMessage";
        toast.className="toast-message";
        document.body.appendChild(toast);
    }
    toast.textContent=message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200);
}

async function apiRequest(path, options = {}){
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {"Content-Type":"application/json", ...(options.headers || {})},
        ...options
    });
    const data = await response.json().catch(() => ({}));
    if(!response.ok) throw new Error(data.error || "No se pudo completar la solicitud.");
    return data;
}

function renderCart(){
    const cart=readCart();
    const count=document.getElementById("cartCount"),list=document.getElementById("cartItems"),sum=document.getElementById("cartTotal"),link=document.getElementById("checkoutLink");
    if(count)count.textContent=cart.length;
    if(sum)sum.textContent=money(total(cart));
    if(link)link.href=cart.length?checkoutUrl(cart):"contacto.html";
    if(!list)return;
    list.innerHTML="";
    if(!cart.length){list.innerHTML='<p class="empty">Tu carrito está vacío.</p>';return}
    cart.forEach((item,index)=>{
        const row=document.createElement("div");
        row.className="cart-row";
        row.innerHTML=`<div><strong>${escapeHtml(item.name)}</strong><p>${money(item.price)}</p></div><button type="button">Quitar</button>`;
        row.querySelector("button").addEventListener("click",()=>removeItem(index));
        list.appendChild(row)
    })
}

function selectedCards(){return [...document.querySelectorAll(".product-card")].filter(card=>card.querySelector(".select-item")?.checked).map(itemFromCard)}

function renderCheckout(){
    const cart=readCart();
    const params=new URLSearchParams(location.search);
    const tipo=params.get("tipo");
    const pedidoParam=params.get("pedido");
    const totalParam=params.get("total");
    const pedido=document.getElementById("pedidoResumen");
    const totalInput=document.getElementById("totalPedido");
    const items=document.getElementById("checkoutItems");
    const typeSelect=document.getElementById("tipoSolicitud");
    const legend=document.getElementById("formLegend");
    if(typeSelect&&tipo)typeSelect.value=tipo==="testimonio"?"testimonio":tipo==="combo"?"combo":"compra";
    if(legend&&typeSelect)legend.textContent=typeSelect.value==="testimonio"?"Testimonio":typeSelect.value==="combo"?"Combo personalizado":"Pedido";
    if(pedido&&!pedido.value)pedido.value=cart.length?cart.map(i=>`${i.name} (${money(i.price)})`).join("\n"):(pedidoParam||"");
    if(totalInput)totalInput.value=cart.length?money(total(cart)):(totalParam?money(totalParam):"");
    if(items){
        if(cart.length){
            items.innerHTML=cart.map(i=>`<div class="cart-row"><strong>${escapeHtml(i.name)}</strong><span>${money(i.price)}</span></div>`).join("")
        }else if(pedidoParam){
            items.innerHTML=pedidoParam.split(/\n|,/).filter(Boolean).map(line=>`<div class="cart-row"><strong>${escapeHtml(line.trim())}</strong><span>${totalParam?money(totalParam):""}</span></div>`).join("")
        }else{
            items.innerHTML='<p class="empty">Puedes escribir tu pedido o volver al catálogo.</p>'
        }
    }
    updateWhatsappOrder()
}

function updateWhatsappOrder(){
    const order=document.getElementById("whatsappOrder");
    if(!order)return;
    const pedido=document.getElementById("pedidoResumen")?.value||"Pedido por confirmar";
    const totalValue=document.getElementById("totalPedido")?.value||"Total por confirmar";
    const metodo=document.getElementById("metodoPago")?.value||"Método por confirmar";
    const nombre=document.getElementById("nombre")?.value||"";
    const correo=document.getElementById("correo")?.value||"";
    order.href=whatsappUrl(`Hola Piñexus Streaming. Quiero realizar esta solicitud:\n${pedido}\nTotal: ${totalValue}\nMétodo: ${metodo}\nNombre: ${nombre}\nCorreo: ${correo}\nAdjuntaré mi voucher.`)
}

function isCombo(servicio){
    const category = normalizeId(servicio.categoria);
    const name = normalizeId(servicio.nombre);
    return category.includes("combo") || name.includes("combo");
}

function servicioKeywords(servicio){
    const base = `${servicio.categoria || ""} ${servicio.plataforma || ""} ${servicio.nombre || ""} ${servicio.descripcion || ""}`.toLowerCase();
    const extra = [];
    if(base.includes("netflix") || base.includes("hbo") || base.includes("prime") || base.includes("pelicula") || base.includes("series")) extra.push("series peliculas");
    if(base.includes("disney") || base.includes("vix") || base.includes("familia")) extra.push("familia");
    if(base.includes("espn") || base.includes("deporte")) extra.push("deportes");
    if(base.includes("crunchy") || base.includes("anime")) extra.push("anime");
    if(base.includes("spotify") || base.includes("musica") || base.includes("podcast")) extra.push("musica");
    if(isCombo(servicio)) extra.push("combo");
    return `${base} ${extra.join(" ")}`.trim();
}

function servicioCard(servicio){
    const nombre = servicio.nombre || "Servicio";
    const precio = Number(servicio.precio || 0);
    const categoria = servicioKeywords(servicio) || "producto";
    const type = isCombo(servicio) ? "combo" : "producto";
    const rawImagen = servicio.imagen || "img/garantia.png";
    const imagen = rawImagen.startsWith("img/") ? rawImagen : `img/${rawImagen}`;
    const descripcion = servicio.descripcion || "Servicio de streaming disponible.";
    const calidad = servicio.calidad || "Full HD";
    const pill = type === "combo" ? "Combo" : (servicio.destacado ? "Destacado" : (servicio.plataforma || "Streaming"));
    const deviceCopy = type === "combo" ? "Pack mensual" : "1 dispositivo";
    return `<article class="product-card" data-type="${type}" data-category="${escapeHtml(categoria)}" data-name="${escapeHtml(nombre)}" data-price="${precio}">
        <img class="product-image" src="${escapeHtml(imagen)}" alt="${escapeHtml(nombre)}" loading="lazy">
        <div class="product-body">
            <span class="pill">${escapeHtml(pill)}</span>
            <h3>${escapeHtml(nombre)}</h3>
            <p>${escapeHtml(descripcion)}</p>
            <strong class="price">${money(precio)}</strong>
        </div>
        <ul class="specs">
            <li><img src="img/dispositivo.png" alt="" loading="lazy">${deviceCopy}</li>
            <li><img src="img/4k-fullhd.png" alt="" loading="lazy">${escapeHtml(calidad)}</li>
            <li><img src="img/garantia.png" alt="" loading="lazy">Garantía</li>
        </ul>
        <div class="card-actions">
            <label><input type="checkbox" class="select-item"> Seleccionar</label>
            <button class="boton boton-morado add-cart" type="button">Agregar</button>
        </div>
    </article>`
}

function bindCatalogButtons(){
    document.querySelectorAll(".add-cart").forEach(btn=>{
        if(btn.dataset.bound)return;
        btn.dataset.bound="true";
        btn.addEventListener("click",()=>{const card=btn.closest(".product-card");addItem(itemFromCard(card),card)})
    });
    document.querySelectorAll(".add-direct").forEach(btn=>{
        if(btn.dataset.bound)return;
        btn.dataset.bound="true";
        btn.addEventListener("click",()=>addItem({name:btn.dataset.name,price:Number(btn.dataset.price),type:"combo"},btn.closest("article")))
    });
}

async function loadServiciosFromApi(){
    const servicesGrid = document.getElementById("servicesGrid");
    const combosGrid = document.getElementById("combosGrid");
    if(!servicesGrid || !document.getElementById("searchInput")) return;
    try{
        const servicios = await apiRequest("/servicios");
        if(!Array.isArray(servicios) || !servicios.length) return;
        const individuales = servicios.filter(servicio => !isCombo(servicio));
        const combos = servicios.filter(isCombo);
        servicesGrid.innerHTML = individuales.map(servicioCard).join("");
        if(combosGrid) combosGrid.innerHTML = combos.map(servicioCard).join("");
        bindCatalogButtons();
        filterCatalog();
    }catch(error){
        console.warn("Catálogo usando contenido local:", error.message);
    }
}

function initReveal(){
    const items=[...document.querySelectorAll(".trust-grid article,.product-card,.combo-strip article,.testimonial-grid article,.form-card,.checkout-side,.payment-box,.support-tips,.client-panel,.login-card")];
    items.forEach(item=>item.classList.add("reveal"));
    if(!("IntersectionObserver" in window)){items.forEach(item=>item.classList.add("is-visible"));return}
    const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        })
    },{threshold:.12});
    items.forEach(item=>observer.observe(item));
}

function filterCatalog(){
    const search=document.getElementById("searchInput");
    const filter=document.getElementById("categoryFilter");
    const term=(search?.value||"").toLowerCase();
    const cat=filter?.value||"todos";
    document.querySelectorAll(".product-card[data-category]").forEach(card=>{
        const haystack=`${card.dataset.name} ${card.dataset.category} ${card.innerText}`.toLowerCase();
        const okCat=cat==="todos"||card.dataset.type===cat||(card.dataset.category||"").includes(cat);
        const okTerm=!term||haystack.includes(term);
        card.classList.toggle("hidden",!(okCat&&okTerm))
    })
}

function getSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY))}catch{return null}}
function setSession(user){
    const nombre = user.nombre || [user.nombres, user.apellidos].filter(Boolean).join(" ") || "Cliente";
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        id:user.idcliente || user.id,
        nombre,
        correo:user.correo || user.email,
        telefono:user.telefono,
        loginAt:new Date().toISOString()
    }))
}
function clearSession(){localStorage.removeItem(SESSION_KEY)}

async function registerUser({nombre, correo, telefono, password}){
    return apiRequest("/auth/register", {method:"POST", body:JSON.stringify({nombre, correo, telefono, password})});
}

async function loginUser({identifier, password}){
    return apiRequest("/auth/login", {method:"POST", body:JSON.stringify({identifier, password})});
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
    if(!document.getElementById("authCard")) return;

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

    document.getElementById("loginForm")?.addEventListener("submit", async event => {
        event.preventDefault();
        const identifier = document.getElementById("loginUser").value;
        const password = document.getElementById("loginPass").value;
        if(!identifier.trim() || !password){setAuthNote("loginNote","Completa correo/teléfono y contraseña.","error"); return}
        try{
            setAuthNote("loginNote","Revisando tus datos de acceso...","success");
            const result = await loginUser({identifier, password});
            setSession(result.user);
            setAuthNote("loginNote","¡Bienvenido de nuevo! Abriendo tu cuenta...","success");
            renderAccountView();
        }catch(error){
            setAuthNote("loginNote", error.message, "error");
        }
    });

    document.getElementById("registerForm")?.addEventListener("submit", async event => {
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
        try{
            setAuthNote("registerNote","Creando tu cuenta de cliente...","success");
            const result = await registerUser({nombre, correo, telefono, password});
            setSession(result.user);
            setAuthNote("registerNote","Cuenta creada. Cargando tu panel...","success");
            renderAccountView();
        }catch(error){
            setAuthNote("registerNote", error.message, "error");
        }
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        clearSession();
        setAuthNote("loginNote","Sesión cerrada.","success");
        renderAccountView();
    });

    renderAccountView();
}

document.addEventListener("DOMContentLoaded",async ()=>{
    document.getElementById("mobileMenuBtn")?.addEventListener("click",()=>document.getElementById("navegacion")?.classList.toggle("mostrar"));
    document.getElementById("cartFloat")?.addEventListener("click",openCart);
    document.getElementById("closeCart")?.addEventListener("click",closeCart);
    document.getElementById("cartBackdrop")?.addEventListener("click",closeCart);
    await loadServiciosFromApi();
    bindCatalogButtons();
    initReveal();
    document.getElementById("buySelected")?.addEventListener("click",()=>{const items=selectedCards();if(!items.length){openCart();return}saveCart(items);location.href=checkoutUrl(items)});
    document.getElementById("searchInput")?.addEventListener("input",filterCatalog);
    document.getElementById("categoryFilter")?.addEventListener("change",filterCatalog);
    document.getElementById("clearCart")?.addEventListener("click",()=>saveCart([]));
    ["pedidoResumen","totalPedido","metodoPago","nombre","correo","tipoSolicitud"].forEach(id=>document.getElementById(id)?.addEventListener("input",updateWhatsappOrder));
    document.getElementById("tipoSolicitud")?.addEventListener("change",renderCheckout);
    document.getElementById("purchaseForm")?.addEventListener("submit",event=>{event.preventDefault();document.getElementById("formNote").textContent="Solicitud preparada. Envíala por WhatsApp y adjunta tu voucher.";updateWhatsappOrder()});
    document.getElementById("supportForm")?.addEventListener("submit",event=>{event.preventDefault();const s=document.getElementById("servicioSoporte").value;const p=document.getElementById("problema").value;const d=document.getElementById("detalleSoporte").value;document.getElementById("supportWhatsapp").href=whatsappUrl(`Hola Piñexus Streaming. Necesito soporte.\nServicio: ${s}\nProblema: ${p}\nDetalle: ${d}\nAdjuntaré captura si corresponde.`);document.getElementById("supportNote").textContent="Soporte preparado. Envíalo por WhatsApp con tu captura."});
    initAuth();
    renderCart();
    renderCheckout();
});
