const SECURITY_CONFIG = {
    MAX_ATTEMPTS: 3,
    RECOVERY_CODE_COUNT: 8,
    STORAGE_KEY: 'secureAuthSystemV2'
  };
  
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
        'SHA-256', 
        encoder.encode(password)
    );
    return Array.from(new Uint8Array(hashBuffer));
  }
  
  function generateRecoveryCodes() {
    const codes = new Set();
    while(codes.size < SECURITY_CONFIG.RECOVERY_CODE_COUNT) {
        codes.add(Math.random().toString(36).slice(2, 10).toUpperCase());
    }
    return Array.from(codes);
  }
  
  async function handleRegistration(e) {
    e.preventDefault();
    const email = document.getElementById('regEmail').value.toLowerCase();
    const password = document.getElementById('regPassword').value;
    const confirmPass = document.getElementById('regConfirm').value;
  
    if(password !== confirmPass) {
        alert('Password confirmation does not match!');
        return;
    }
  
    const recoveryCodes = generateRecoveryCodes();
    console.log('Generated Recovery Codes:', recoveryCodes.join(' | '));
  
    localStorage.setItem(SECURITY_CONFIG.STORAGE_KEY, JSON.stringify({
        email: email,
        passwordHash: await hashPassword(password),
        recoveryCodes: recoveryCodes,
        loginAttempts: 0
    }));
  
    switchView('loginPanel');
  }
  
  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const authData = JSON.parse(localStorage.getItem(SECURITY_CONFIG.STORAGE_KEY));
  
    if(!authData || authData.email !== email) {
        return handleFailedLogin(authData);
    }
  
    const isMatch = (await hashPassword(password)).every(
        (val, i) => val === authData.passwordHash[i]
    );
  
    if(isMatch) {
        authData.loginAttempts = 0;
        localStorage.setItem(SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(authData));
        switchView('dashboard');
    } else {
        handleFailedLogin(authData);
    }
  }
  
  function handleFailedLogin(authData) {
    authData.loginAttempts++;
    
    if(authData.loginAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS) {
        switchView('recoveryPanel');
    } else {
        document.getElementById('attemptAlert').classList.remove('hidden');
        document.getElementById('attemptAlert').textContent = 
            `Remaining attempts: ${SECURITY_CONFIG.MAX_ATTEMPTS - authData.loginAttempts}`;
    }
    
    localStorage.setItem(SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(authData));
  }
  
  function handleRecovery(e) {
    e.preventDefault();
    const code = document.getElementById('recoveryCode').value.toUpperCase();
    const authData = JSON.parse(localStorage.getItem(SECURITY_CONFIG.STORAGE_KEY));
  
    if(authData?.recoveryCodes.includes(code)) {
        authData.loginAttempts = 0;
        authData.recoveryCodes = authData.recoveryCodes.filter(c => c !== code);
        localStorage.setItem(SECURITY_CONFIG.STORAGE_KEY, JSON.stringify(authData));
        alert('Recovery successful! Please login again.');
        switchView('loginPanel');
    } else {
        alert('Invalid recovery code!');
    }
  }
  
  function initiateLogout() {
    document.getElementById('confirmationDialog').classList.remove('hidden');
  }
  
  function confirmLogout(confirm) {
    document.getElementById('confirmationDialog').classList.add('hidden');
    if(confirm) {
        switchView('loginPanel');
    }
  }
  
  function switchView(viewId) {
    document.querySelectorAll('.auth-panel, #dashboard').forEach(el => 
        el.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
  }
  
  // Event Listeners
  document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('recoveryForm').addEventListener('submit', handleRecovery);
  
  // Initialization
  if(!localStorage.getItem(SECURITY_CONFIG.STORAGE_KEY)) {
    switchView('registerPanel');
  } else {
    switchView('loginPanel');
  }