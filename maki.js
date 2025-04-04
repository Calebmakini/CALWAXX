 // Section Navigation
 function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
}

// Deposit Functionality
function depositFunds() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (!isNaN(amount) && amount > 0) {
        const balanceElement = document.getElementById('balanceAmount');
        const currentBalance = parseFloat(balanceElement.textContent);
        balanceElement.textContent = (currentBalance + amount).toFixed(2);
        alert(`Successfully deposited $${amount.toFixed(2)}`);
    }
}

// Messaging System
function sendMessage() {
    const messageInput = document.getElementById('newMessage');
    const messageContainer = document.getElementById('message-container');
    
    if (messageInput.value.trim()) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = messageInput.value;
        messageDiv.style.padding = '5px';
        messageDiv.style.margin = '5px 0';
        messageDiv.style.backgroundColor = '#f0f0f0';
        messageContainer.appendChild(messageDiv);
        messageInput.value = '';
    }
}

// Profile Update
function updateProfile() {
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    alert('Profile updated successfully!');
}

// Call Functions (Placeholder)
function startVideoCall() {
    alert('Starting video call...');
}

function startVoiceCall() {
    alert('Starting voice call...');
}
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const statusText = document.getElementById('statusText');

fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      statusText.textContent = 'Photo uploaded successfully!';
      statusText.style.color = '#4a90e2';
    }
    
    reader.readAsDataURL(file);
  }
});

// Mobile camera detection
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  statusText.textContent = 'Camera access not supported in this browser';
  statusText.style.color = '#ff4444';
}

class DeviceAnalytics {
    constructor() {
      this.deviceInfo = this.getDeviceData();
      this.networkInfo = this.getNetworkData();
      this.timeInfo = this.getTimeData();
      this.displayAnalytics();
    }

    getDeviceData() {
      return {
        platform: navigator.platform,
        architecture: navigator.userAgent.match(/\((.*?)\)/)[1],
        cores: navigator.hardwareConcurrency || 'Unknown',
        memory: navigator.deviceMemory || 'Unknown',
        touch: navigator.maxTouchPoints > 0,
        pixelRatio: window.devicePixelRatio,
        browser: this.detectBrowser(),
        language: navigator.language
      };
    }

    getNetworkData() {
      return {
        connection: navigator.connection ? {
          type: navigator.connection.effectiveType,
          rtt: navigator.connection.rtt,
          downlink: navigator.connection.downlink
        } : null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        region: navigator.language.split('-')[1] || 'XX'
      };
    }

    getTimeData() {
      return {
        localTime: new Date().toLocaleString(),
        timezoneOffset: new Date().getTimezoneOffset(),
        daylightSavings: this.checkDaylightSavings()
      };
    }

    detectBrowser() {
      const ua = navigator.userAgent;
      return {
        name: ua.match(/(Firefox|Chrome|Safari|Edge|Opera)/)?.[0],
        version: ua.match(/(?:Firefox|Chrome|Safari|Edge|Opera)[\/ ]([\d.]+)/)?.[1]
      };
    }

    checkDaylightSavings() {
      const date = new Date();
      return date.getTimezoneOffset() < Math.max(
        new Date(date.getFullYear(), 0, 1).getTimezoneOffset(),
        new Date(date.getFullYear(), 6, 1).getTimezoneOffset()
      );
    }

    displayAnalytics() {
      document.getElementById('deviceData').innerHTML = `
        <h2>Device Profile</h2>
        <p>🖥 Platform: ${this.deviceInfo.platform}</p>
        <p>⚙️ Architecture: ${this.deviceInfo.architecture}</p>
        <p>💾 Memory: ${this.deviceInfo.memory}GB</p>
        <p>🔍 Pixel Ratio: ${this.deviceInfo.pixelRatio}x</p>
        <p>🌐 Browser: ${this.deviceInfo.browser.name} ${this.deviceInfo.browser.version}</p>
      `;

      document.getElementById('networkData').innerHTML = `
        <h2>Network & Regional Data</h2>
        <p>📶 Connection: ${this.networkInfo.connection?.type || 'Unknown'}</p>
        <p>⏰ Timezone: ${this.networkInfo.timezone}</p>
        <p>📍 Region Code: ${this.networkInfo.region}</p>
      `;

      document.getElementById('timeData').innerHTML = `
        <h2>Temporal Analysis</h2>
        <p>🕒 Local Time: ${this.timeInfo.localTime}</p>
        <p>🌍 UTC Offset: UTC${this.timeInfo.timezoneOffset > 0 ? '-' : '+'}${Math.abs(this.timeInfo.timezoneOffset)/60}</p>
        <p>🔆 Daylight Savings: ${this.timeInfo.daylightSavings ? 'Active' : 'Inactive'}</p>
      `;
    }
  }

  new DeviceAnalytics();



  class GeoDeviceAnalyzer {
    constructor() {
      this.deviceData = this.getDeviceInfo();
      this.networkData = this.getNetworkInfo();
      this.initGeoDetection();
    }

    getDeviceInfo() {
      return {
        platform: navigator.platform,
        architecture: navigator.userAgent.match(/\((.*?)\)/)[1],
        cores: navigator.hardwareConcurrency,
        memory: navigator.deviceMemory || 'Unknown',
        resolution: `${screen.width}x${screen.height}`,
        pixelRatio: window.devicePixelRatio
      };
    }

    getNetworkInfo() {
      const connection = navigator.connection || {};
      return {
        type: connection.effectiveType || 'Unknown',
        rtt: connection.rtt ? `${connection.rtt}ms` : 'N/A',
        downlink: connection.downlink ? `${connection.downlink}Mb/s` : 'N/A',
        ipVersion: this.detectIPProtocol()
      };
    }

    detectIPProtocol() {
      try {
        const rtc = new RTCPeerConnection();
        return rtc.createDataChannel('').close() ? 'IPv6' : 'IPv4';
      } catch {
        return 'Unknown';
      }
    }

    async initGeoDetection() {
      try {
        const position = await this.estimatePosition();
        this.initMap(position);
        this.displayGeoData(position);
      } catch (error) {
        console.error('Geo estimation failed:', error);
      }
    }

    async estimatePosition() {
      // Fallback to IP-based geolocation
      const response = await fetch(`https://ipapi.co/json/`);
      const data = await response.json();
      return {
        coords: {
          latitude: data.latitude,
          longitude: data.longitude
        },
        country: data.country_name,
        city: data.city
      };
    }

    initMap(position) {
      const mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      
      new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    displayGeoData(position) {
      document.getElementById('geoData').innerHTML = `
        <p>📍 Estimated Location: ${position.city}, ${position.country}</p>
        <p>🌐 Coordinates: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}</p>
      `;
    }

    renderDashboard() {
      document.getElementById('deviceData').innerHTML = `
        <p>🖥 Platform: ${this.deviceData.platform}</p>
        <p>⚙ Architecture: ${this.deviceData.architecture}</p>
        <p>💾 Memory: ${this.deviceData.memory}GB</p>
      `;

      document.getElementById('networkData').innerHTML = `
        <p>📶 Connection: ${this.networkData.type}</p>
        <p>⏱ Latency: ${this.networkData.rtt}</p>
        <p>🔌 IP Protocol: ${this.networkData.ipVersion}</p>
      `;
    }
  }

  window.initMap = function() {
    new GeoDeviceAnalyzer().renderDashboard();
  };


  
  
      // Weather Fetcher (IP-based location)
      async function fetchWeather() {
        try {
          const ipResponse = await fetch('https://ipapi.co/json/');
          const ipData = await ipResponse.json();
          
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current=temperature_2m,weather_code`
          );
          const weatherData = await weatherResponse.json();
  
          const weatherCodes = {
            0: 'Clear',
            1: 'Mainly Clear',
            2: 'Partly Cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Rime Fog',
            51: 'Drizzle',
            53: 'Drizzle',
            55: 'Drizzle',
            56: 'Freezing Drizzle',
            57: 'Freezing Drizzle',
            61: 'Rain',
            63: 'Rain',
            65: 'Rain',
            66: 'Freezing Rain',
            67: 'Freezing Rain',
            71: 'Snow',
            73: 'Snow',
            75: 'Snow',
            77: 'Snow Grains',
            80: 'Rain Showers',
            81: 'Rain Showers',
            82: 'Rain Showers',
            85: 'Snow Showers',
            86: 'Snow Showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm',
            99: 'Thunderstorm'
          };
  
          document.querySelector('.temp').textContent = 
            `${weatherData.current.temperature_2m}°${weatherData.current_units.temperature_2m}`;
          document.querySelector('.condition').textContent = 
            weatherCodes[weatherData.current.weather_code];
        } catch (error) {
          document.querySelector('.weather').innerHTML = 
            '<div class="temp">--°C</div><div class="condition">Weather Unavailable</div>';
        }
      }
  
   
navigator.getBattery().then(bat => {
  if(bat.charging) return; // Trust charger-connected time
  const timeDiff = Date.now() - performance.timing.navigationStart;
  if(timeDiff > 300000) console.warn('System clock drift detected');
});


// Triple fallback strategy
async function getLocation() {
    return new Promise((resolve) => {
      // 1. Try HTML5 Geolocation
      navigator.geolocation.getCurrentPosition(resolve, 
        // 2. Fallback to IP geolocation
        () => fetch('https://ipapi.co/json/').then(res => resolve(res.json())),
        // 3. Hardcoded fallback
        { timeout: 3000, maximumAge: 600000 }
      );
    });
  }


  
