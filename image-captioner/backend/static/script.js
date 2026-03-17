document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero-section');
    const demoSection = document.getElementById('demo-section');
    const btnDemo = document.getElementById('btn-demo');
    const btnBack = document.getElementById('btn-back');
    
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadStateEmpty = document.getElementById('upload-state-empty');
    const uploadStatePreview = document.getElementById('upload-state-preview');
    const imagePreview = document.getElementById('image-preview');
    const btnClear = document.getElementById('btn-clear');
    const btnGenerate = document.getElementById('btn-generate');
    
    const resultArea = document.getElementById('result-area');
    const captionText = document.getElementById('caption-text');
    
    let currentFile = null;

    // View Switching
    btnDemo.addEventListener('click', () => {
        heroSection.classList.add('hidden');
        setTimeout(() => {
            demoSection.classList.remove('hidden');
        }, 500); // Wait for hero to fade out
    });

    btnBack.addEventListener('click', () => {
        demoSection.classList.add('hidden');
        setTimeout(() => {
            heroSection.classList.remove('hidden');
        }, 500); // Wait for demo to fade out
    });

    // File Upload Handling
    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, WEBP).');
            return;
        }
        
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            uploadStateEmpty.classList.add('hidden');
            uploadStatePreview.classList.remove('hidden');
            btnGenerate.removeAttribute('disabled');
            
            // Hide previous results if any
            resultArea.classList.add('hidden');
        };
        
        reader.readAsDataURL(file);
    };

    // Click to upload
    dropZone.addEventListener('click', (e) => {
        if (e.target !== btnClear) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Clear Image
    btnClear.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering dropZone click
        currentFile = null;
        fileInput.value = '';
        imagePreview.src = '';
        
        uploadStatePreview.classList.add('hidden');
        uploadStateEmpty.classList.remove('hidden');
        btnGenerate.setAttribute('disabled', 'true');
        resultArea.classList.add('hidden');
    });

    // API Call
    btnGenerate.addEventListener('click', async () => {
        if (!currentFile) return;

        // UI Loading State
        btnGenerate.setAttribute('disabled', 'true');
        const originalText = btnGenerate.textContent;
        btnGenerate.innerHTML = '<span class="loader"></span> Generating...';
        resultArea.classList.add('hidden');

        try {
            const formData = new FormData();
            formData.append('image', currentFile);

            // POST to the relative /caption endpoint since we're serving from Flask directly
            const response = await fetch('/caption', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Display Result
            captionText.textContent = `"${data.caption}"`;
            resultArea.classList.remove('hidden');

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate caption. Make sure the Python Flask server is running on port 5000.');
        } finally {
            // Restore UI
            btnGenerate.removeAttribute('disabled');
            btnGenerate.textContent = originalText;
        }
    });
});
