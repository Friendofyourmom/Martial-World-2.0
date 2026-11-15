(() => {
  const cfg = window.MW_CONFIG || {};
  const hasConfig = !!(cfg.supabaseUrl && cfg.supabasePublishableKey && window.supabase);
  const client = hasConfig ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey) : null;
  const $ = (id) => document.getElementById(id);
  const state = { user:null, character:null, resources:null, currentPage:"home", authMode:"signin", demo:false };
  const pages = ["home","character","cultivation","world","activities","inventory","factions","bazaar","guilds","social","rankings"];
  const labels = {home:"HOME",character:"CHARACTER",cultivation:"CULTIVATION",world:"WORLD",activities:"ACTIVITIES",inventory:"INVENTORY",factions:"FACTIONS",bazaar:"BAZAAR",guilds:"GUILDS",social:"SOCIAL",rankings:"RANKINGS"};
  const fmt = (n) => Number(n || 0).toLocaleString();

  function toast(message){ const el=$("toast"); el.textContent=message; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2600); }
  function setConnection(online,message){ $("connectionDot").parentElement.className="connection "+(online?"online":"offline"); $("connectionText").textContent=message; }
  function setMeter(barId,value,max){ const pct=max>0?Math.max(0,Math.min(100,(Number(value||0)/Number(max))*100)):0; $(barId).style.width=pct+"%"; }
  function renderHud(){
    const c=state.character, r=state.resources;
    $("playerName").textContent=c?.character_name || (state.user?"New Cultivator":"Guest Wanderer");
    $("realmLine").textContent=c?`${realmName(c.realm_key)} · ${stageName(c.realm_stage)}`:(state.user?"Character not created":"Sign in to begin your journey");
    $("silverValue").textContent=r?fmt(r.silver):"—";
    $("lpValue").textContent=r?`${fmt(r.life_points)} / ${fmt(r.max_life_points)}`:"—";
    $("energyValue").textContent=r?`${fmt(r.energy)} / 100`:"—";
    $("kiValue").textContent=r?`${fmt(r.ki)} / ${fmt(r.max_ki || 0)}`:"—";
    $("knowledgeValue").textContent=r?fmt(r.knowledge):"—";
    $("knowledgeNote").textContent=r?"Breakthrough progress":"Breakthrough progress";
    setMeter("lpBar",r?.life_points,r?.max_life_points); setMeter("energyBar",r?.energy,100); setMeter("kiBar",r?.ki,r?.max_ki);
  }
  function realmName(key){return ({ordinary_person:"Ordinary Person",third_rate_warrior:"Third-Rate Warrior",second_rate_warrior:"Second-Rate Warrior",first_rate_warrior:"First-Rate Warrior",peak_warrior:"Peak Warrior",master:"Master",grandmaster:"Grandmaster",supreme_master:"Supreme Master",transcendent:"Transcendent"})[key]||String(key||"Unknown Realm").replaceAll("_"," ").replace(/\b\w/g,x=>x.toUpperCase());}
  function stageName(s){return ({early:"Early Stage",middle:"Middle Stage",late:"Late Stage",peak:"Peak Stage"})[s]||"Early Stage";}
  function pageHeading(title,sub,eyebrow="YOUR JOURNEY"){return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div></div>`;}
  function homePage(){
    const greeting=state.character?`Welcome back, ${escapeHtml(state.character.character_name)}.`:"Your journey through the Murim begins here.";
    return `${pageHeading("Home","Your path through the martial world begins with a single step.")}
      <div class="dashboard-grid">
        <div class="stack">
          <section class="panel welcome-panel"><div><div class="location-tag">⌖ &nbsp; JADE CAPITAL · CENTRAL PLAINS</div><h2>${greeting}</h2><p>The streets of Jade Capital are alive with merchants, travelling martial artists and sect disciples. Your next chapter is yours to write.</p></div><div><button class="gold-button" data-go="world">Explore the world&nbsp; →</button></div></section>
          <section class="panel"><div class="panel-title"><h3>QUICK ACTIONS</h3><span>YOUR PATH</span></div><div class="quick-grid">
            ${quick("⚔","Training","Improve your attributes","cultivation")}${quick("◈","Meditation","Refine your Ki","cultivation")}
            ${quick("▣","Quests","Find your next task","activities")}${quick("◇","Marketplace","Browse available goods","bazaar")}
          </div></section>
          <section class="panel"><div class="panel-title"><h3>RECENT ACTIVITY</h3><span>WORLD FEED</span></div><div class="activity-list">
            <div class="activity-row"><i class="activity-dot"></i><div>Jade Capital remains a gathering place for martial artists.<small>World notice · Available to all cultivators</small></div></div>
            <div class="activity-row"><i class="activity-dot"></i><div>Your personal journey will appear here as you play.<small>Activity log · Connected to your character</small></div></div>
          </div></section>
        </div>
        <div class="stack">
          <section class="panel"><div class="panel-title"><h3>CHARACTER OVERVIEW</h3><span>PROFILE</span></div>
            ${state.character?`<div class="notice"><strong>${escapeHtml(state.character.character_name)}</strong><br>${realmName(state.character.realm_key)} · ${stageName(state.character.realm_stage)}<br><span style="color:#9c9a94">Your character is loaded from the Martial World database.</span></div><button class="secondary-button" style="margin-top:12px" data-go="character">View character →</button>`:`<div class="empty-state"><strong>No character yet</strong>Sign in and create your first cultivator to begin.</div><button class="gold-button full-button" style="margin-top:12px" data-action="create-character">Create character</button>`}
          </section>
          <section class="panel"><div class="panel-title"><h3>YOUR NEXT MILESTONE</h3><span>CULTIVATION</span></div><div class="empty-state"><strong>${state.character?"The path awaits":"A new beginning"}</strong>${state.character?"Visit Cultivation to review your training and breakthrough progress.":"Your realm, Knowledge and cultivation progress will appear here."}</div><button class="secondary-button" style="margin-top:12px" data-go="cultivation">Open cultivation →</button></section>
          <section class="panel"><div class="panel-title"><h3>WORLD STATUS</h3><span>LIVE SYSTEMS</span></div><div class="activity-list"><div class="activity-row"><i class="activity-dot"></i><div>Central Plains<span class="muted"> · Starting region</span></div></div><div class="activity-row"><i class="activity-dot"></i><div>Jade Capital<span class="muted"> · Starting location</span></div></div></div></section>
        </div>
      </div>`;
  }
  function quick(icon,title,sub,page){return `<button class="quick-card" data-go="${page}"><span class="quick-icon">${icon}</span><span><strong>${title}</strong><small>${sub}</small></span></button>`;}
  function genericPage(page){
    const data={
      character:["Character","Your attributes, equipment, condition and personal profile.","PERSONAL PROFILE","Your character details will appear here once your character is loaded."],
      cultivation:["Cultivation","Train your body, refine your Ki and pursue the next realm.","MARTIAL PROGRESSION","Training, meditation and breakthrough interfaces will be connected to the secure gameplay functions in the next build."],
      world:["World","Travel through the regions and discover the hidden places of the Murim.","THE CENTRAL PLAINS","Your current location is Jade Capital. Travel routes, discoveries and expeditions will be connected here."],
      activities:["Activities","Quests, combat, gathering and expeditions.","DAILY LIFE IN THE MURIM","Your activity centre will bring together quests, combat encounters and other world activities."],
      inventory:["Inventory","Manage your items, equipment, manuals and consumables.","YOUR POSSESSIONS","Your inventory and equipment will load from the game database in a later screen integration."],
      factions:["Factions","Choose your loyalties and build your reputation.","THE GREAT ORGANISATIONS","The Murim Alliance, Black Castle Alliance and Crimson Moon Demonic Cult will be represented here."],
      bazaar:["Bazaar","Trade goods and build your own merchant presence.","THE MURIM ECONOMY","NPC shops, player listings, your shop and secure trading will be integrated here."],
      guilds:["Guilds","Join a player organisation or establish your own.","PLAYER ORGANISATIONS","Guild creation, invitations and membership foundations are installed in the database."],
      social:["Social","Meet other cultivators in the shared world.","THE LIVING MURIM","Public profiles, presence and moderated world chat foundations are installed."],
      rankings:["Rankings","See how cultivators stand across the martial world.","WORLD RANKINGS","World, realm, faction and combat ranking screens are planned."],
    };
    const d=data[page]||data.home;
    return `${pageHeading(d[0],d[1],d[2])}<section class="panel"><div class="empty-state"><strong>${d[0]} is being prepared</strong>${d[3]}<br><br><span style="color:#c9a45c">This is a staged build: this screen is a placeholder, not a completed feature.</span></div></section>`;
  }
  function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function navigate(page){
    if(page==="more"){ $("sidebar").classList.toggle("open"); return; }
    if(!pages.includes(page))page="home";
    state.currentPage=page; $("pageCrumb").textContent=labels[page];
    $("pageContent").innerHTML=page==="home"?homePage():genericPage(page);
    document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
    $("sidebar").classList.remove("open");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  async function loadCharacter(){
    if(!client||!state.user)return;
    const {data:character,error}=await client.from("characters").select("id,owner_id,character_name,realm_key,realm_stage,created_at").eq("owner_id",state.user.id).maybeSingle();
    if(error)throw error;
    state.character=character;
    if(character){
      const {data:resources,error:resourceError}=await client.from("character_resources").select("character_id,energy,knowledge,ki,max_ki,life_points,max_life_points,silver,cultivation_xp").eq("character_id",character.id).maybeSingle();
      if(resourceError)throw resourceError;
      state.resources=resources;
      $("characterModal").hidden=true;
    } else {
      state.resources=null;
      $("characterModal").hidden=false;
    }
    renderHud(); navigate(state.currentPage);
  }
  async function refreshSession(){
    if(!client){setConnection(false,"Supabase configuration missing");renderHud();navigate("home");return;}
    try{
      const {data:{session},error}=await client.auth.getSession(); if(error)throw error;
      state.user=session?.user||null;
      if(state.user){setConnection(true,"Connected · signed in");$("signOutBtn").hidden=false;await loadCharacter();}
      else{setConnection(true,"Connected · not signed in");$("signOutBtn").hidden=true;state.character=null;state.resources=null;renderHud();navigate("home");}
    }catch(e){console.error(e);setConnection(false,"Connection check failed");toast("Could not load your account. Check your connection.");}
  }
  function openAuth(){state.authMode="signin";updateAuthMode();$("authModal").hidden=false;}
  function updateAuthMode(){
    const signup=state.authMode==="signup";
    $("authTitle").textContent=signup?"Create your account":"Welcome back";
    $("authDescription").textContent=signup?"Create an account to enter the Murim.":"Sign in to continue your journey.";
    $("authSubmit").textContent=signup?"Create account":"Sign in";
    $("toggleAuth").textContent=signup?"Already have an account? Sign in":"Need an account? Create one";
    $("authPassword").autocomplete=signup?"new-password":"current-password";$("authMessage").textContent="";
  }
  async function submitAuth(e){
    e.preventDefault(); if(!client){$("authMessage").textContent="Supabase is not configured. Check config.js.";return;}
    const email=$("authEmail").value.trim(),password=$("authPassword").value;
    $("authSubmit").disabled=true;$("authMessage").textContent="Please wait…";
    try{
      let result;
      if(state.authMode==="signup")result=await client.auth.signUp({email,password});
      else result=await client.auth.signInWithPassword({email,password});
      if(result.error)throw result.error;
      if(state.authMode==="signup"&&!result.data.session){$("authMessage").textContent="Account created. Check your email to confirm, then sign in.";return;}
      $("authModal").hidden=true;state.user=result.data.user;await loadCharacter();toast("Welcome to the Murim.");
    }catch(err){$("authMessage").textContent=err.message||"Authentication failed.";}
    finally{$("authSubmit").disabled=false;}
  }
  async function createCharacter(e){
    e.preventDefault();if(!client||!state.user){$("characterMessage").textContent="Please sign in first.";return;}
    const name=$("characterName").value.trim();$("createCharacterBtn").disabled=true;$("characterMessage").textContent="Creating your character…";
    try{
      const {error}=await client.rpc("create_character",{p_character_name:name,p_appearance_key:$("appearanceKey").value,p_background_key:$("backgroundKey").value});
      if(error)throw error;
      await loadCharacter();toast("Your journey begins."); 
    }catch(err){$("characterMessage").textContent=err.message||"Could not create character.";}
    finally{$("createCharacterBtn").disabled=false;}
  }
  document.addEventListener("click",e=>{
    const page=e.target.closest("[data-page]");if(page){e.preventDefault();navigate(page.dataset.page);return;}
    const go=e.target.closest("[data-go]");if(go){navigate(go.dataset.go);return;}
    const action=e.target.closest("[data-action]")?.dataset.action;
    if(action==="create-character")$("characterModal").hidden=false;
  });
  $("menuBtn").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
  $("accountButton").addEventListener("click",()=>state.user?toast("Signed in as "+state.user.email):openAuth());
  $("closeAuth").addEventListener("click",()=>$("authModal").hidden=true);
  $("closeCharacter").addEventListener("click",()=>{if(!state.character)toast("Create a character to begin.");else $("characterModal").hidden=true;});
  $("authForm").addEventListener("submit",submitAuth);
  $("toggleAuth").addEventListener("click",()=>{state.authMode=state.authMode==="signin"?"signup":"signin";updateAuthMode();});
  $("characterForm").addEventListener("submit",createCharacter);
  $("signOutBtn").addEventListener("click",async()=>{if(client){await client.auth.signOut();state.user=null;state.character=null;state.resources=null;renderHud();navigate("home");$("signOutBtn").hidden=true;setConnection(true,"Connected · not signed in");toast("Signed out.");}});
  if(client)client.auth.onAuthStateChange((_event,session)=>{state.user=session?.user||null;if(!state.user){state.character=null;state.resources=null;renderHud();navigate("home");}});
  renderHud();navigate("home");refreshSession();
})();