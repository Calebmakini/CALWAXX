 

 


let members = JSON.parse(localStorage.getItem('members') || '[]');
    
function updateMemberDisplay() {
    const tbody = document.getElementById('membersBody');
    tbody.innerHTML = members.map(member => `
        <tr>
            <td class="avatar-cell">
                <img src="${member.avatar}" class="circular-avatar" alt="Avatar">
            </td>
            <td>${member.fullName}</td>
            <td>
                <div>${member.email}</div>
                <div>${member.phone}</div>
            </td>
            <td>
                <div>Gender: ${member.gender}</div>
                <div>DOB: ${member.dob}</div>
                <div>Joined: ${new Date(member.dateAdded).toLocaleDateString()}</div>
            </td>
            <td>
                <button onclick="toggleStatus('${member.id}')" 
                        style="background: ${member.status === 'active' ? 'var(--danger)' : 'var(--success)'}">
                    ${member.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button onclick="deleteMember('${member.id}')" 
                        style="background: var(--danger)">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('memberCount').textContent = members.length;
    localStorage.setItem('members', JSON.stringify(members));
}

function handleSubmit(event) {
    event.preventDefault();
    const newMember = {
        id: Date.now().toString(),
        avatar: document.getElementById('avatarPreview').querySelector('img').src,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        dateAdded: new Date().toISOString(),
        status: 'active'
    };
    
    members.push(newMember);
    closeModal();
    updateMemberDisplay();
    return false;
}

// Helper functions
function previewAvatar(event) {
    const preview = document.getElementById('avatarPreview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" 
                class="circular-avatar" style="width:80px;height:80px">`;
        }
        reader.readAsDataURL(file);
    }
}

function showAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addMemberModal').style.display = 'none';
    document.getElementById('memberForm').reset();
    document.getElementById('avatarPreview').innerHTML = '';
}

function deleteMember(id) {
    members = members.filter(m => m.id !== id);
    updateMemberDisplay();
}

function toggleStatus(id) {
    members = members.map(m => 
        m.id === id ? {...m, status: m.status === 'active' ? 'suspended' : 'active'} : m
    );
    updateMemberDisplay();
}

// Initial load
updateMemberDisplay();