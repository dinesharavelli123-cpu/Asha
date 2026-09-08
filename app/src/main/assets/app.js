// Step 1 intentionally keeps JavaScript minimal.
// The loading screen is driven by CSS so it cannot get stuck at 0% if a timer is throttled.
window.addEventListener('load',()=>{
  document.documentElement.dataset.saahayReady='1';
});
