// Accordion Interaction
function handleAccordion(id) {
    const panel = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);

    // Toggle selected
    panel.classList.toggle('open');
    if(icon) {
        icon.style.transform = panel.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// Form Submission & Pass Generation
document.getElementById('enrollment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submit-btn');
    const status = document.getElementById('status-message');
    
    // 1. Loading State
    btn.innerText = "⏳ Generating Your Ticket...";
    btn.disabled = true;

    // 2. Prepare Data
    // Generates a unique ID like SN-A1B2C3
    const ticketId = 'SN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('ticket_id').value = ticketId;
    
    const formData = new FormData(this);
    
    // 3. Your Provided AppScript URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzO-xozNbcYdNVzRE8XE8ZDBZ8bRp5TXPLbxr6HHASC6PmXlyE50Fr0C0usdceNDzmC/exec";

    // 4. Submit to Google Sheets
    fetch(SCRIPT_URL, { 
        method: 'POST', 
        body: formData 
    })
    .then(response => {
        // 5. Populate the Ticket UI with Form Data
        document.getElementById('pass-name').innerText = formData.get('name');
        document.getElementById('pass-college').innerText = formData.get('college');
        document.getElementById('ticket-id-display').innerText = ticketId;

        // 6. Reveal the Ticket and Scroll to it
        document.getElementById('ticket-wrapper').classList.remove('hidden');
        document.getElementById('ticket-wrapper').scrollIntoView({ behavior: 'smooth' });
        
        btn.innerText = "Ticket Generated! ✅";
        status.innerHTML = "<p style='color:green; margin-top:10px; font-weight:bold;'>Registration successful! See your pass below.</p>";
    })
    .catch(error => {
        console.error('Error!', error.message);
        btn.disabled = false;
        btn.innerText = "Generate My Entry Ticket 🎟️";
        status.innerHTML = "<p style='color:red;'>Connection Error. Please try again.</p>";
    });
});

// PDF Generator Function
async function savePassAsPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('ticket');
    
    // Check if libraries are loaded
    if (!window.html2canvas) {
        console.error("html2canvas library not found");
        return;
    }

    html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape, mm, A4 size
        pdf.addImage(imgData, 'PNG', 15, 15, 260, 140);
        pdf.save('ServiceNow_Seminar_Pass.pdf');
    });
}