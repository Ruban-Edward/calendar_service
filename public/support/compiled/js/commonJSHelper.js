/**
 * Initialize Tippy tooltips with custom settings.
 * 
 * @author Rama Selvan
 * @param {string} id - The selector or element to attach the tooltip to.
 * @param {string} content - The content to display inside the tooltip.
 * @param {string} place - The placement of the tooltip (e.g., "top", "right").
 */
function initializeTooltip(id, content, place) {
    tippy(id, {
        content: content,
        placement: place,
        animation: "scale-extreme",
        arrow: true,
        theme: "custom",
        trigger: "mouseenter",
        delay: [300, 100], // Delay before showing and hiding the tooltip
    });
}


/**
 * @author Rama Selvan 
 * Formats a date string to DD-MM-YYYY format.
 * @param {string} dateString - The date string in YYYY-MM-DD format.
 * @returns {string} - The formatted date string.
 */
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

/**
 * @author Ruban Edward 
 * Used to show the members conflict 
 * @param {string} conflictMembers
 * @returns {string}
 */
function showToast(conflictMembers) {
    // Ensure conflictMembers is an array
    if (typeof conflictMembers === 'string') {
        conflictMembers = conflictMembers.split(',').map(item => item.trim());
    }
    if (!Array.isArray(conflictMembers)) {
        conflictMembers = [conflictMembers];
    }

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.setAttribute('class', 'toast-container position-fixed top-0 end-0 p-3');
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.setAttribute('class', 'toast fade show');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    // Toast header
    const toastHeader = document.createElement('div');
    toastHeader.setAttribute('class', 'toast-header');

    const toastTitle = document.createElement('strong');
    toastTitle.setAttribute('class', 'me-auto');
    toastTitle.innerText = 'Warning!';

    const toastTime = document.createElement('small');
    toastTime.innerText = 'Just now';

    const toastClose = document.createElement('button');
    toastClose.setAttribute('type', 'button');
    toastClose.setAttribute('class', 'btn-close');
    toastClose.setAttribute('data-bs-dismiss', 'toast');
    toastClose.setAttribute('aria-label', 'Close');

    toastHeader.appendChild(toastTitle);
    toastHeader.appendChild(toastTime);
    toastHeader.appendChild(toastClose);

    // Toast body
    const toastBody = document.createElement('div');
    toastBody.setAttribute('class', 'toast-body');

    const introText = document.createElement('p');
    introText.innerText = 'The following members have conflicting schedules:';
    toastBody.appendChild(introText);

    // Create a list for members
    const memberList = document.createElement('ul');
    memberList.setAttribute('class', 'member-list');
    memberList.style.listStyleType = 'none';
    memberList.style.padding = '0';

    conflictMembers.forEach(member => {
        const memberItem = document.createElement('li');
        memberItem.innerText = member;
        memberList.appendChild(memberItem);
    });

    toastBody.appendChild(memberList);

    // Append header and body to toast
    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);

    // Append toast to toast container
    toastContainer.appendChild(toast);
}

/**
     * @author     Jeril
     * @datetime   31 July 2024
     * @param {string} micButtonId - The ID of the microphone button element.
     * @param {string} textareaId - The ID of the textarea element where the transcribed text will be displayed.
     * @returns {void}
     * Purpose: Function to provide the voice recording functionality to record voice and show in the respective text area of that particular notes.
     * 
     */
function voiceRecognition(micButtonId, textareaId) {
    const micButton = document.getElementById(micButtonId);
    const generalTextarea = document.getElementById(textareaId);
    let isRecording = false;
    let finalTranscript = '';

    // Initialize SpeechRecognition
    const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        isRecording = true;
        micButton.style.color = "red"; // Change button color to indicate recording
        console.log('Speech recognition started.');
    };

    recognition.onend = function() {
        isRecording = false;
        micButton.style.color = "blue"; // Change button color to indicate not recording
        console.log('Speech recognition ended.');
    };

    recognition.onresult = function(event) {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        generalTextarea.value = finalTranscript + interimTranscript;
        console.log('Textarea updated with: ', generalTextarea.value);
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech' || event.error === 'audio-capture' || event.error === 'not-allowed') {
            isRecording = false;
            micButton.style.color = "blue"; // Reset button color
        }
    };
    micButton.addEventListener('click', function() {
        if (isRecording) {
            recognition.stop();
        } else {
            finalTranscript = generalTextarea.value; // Append new text to existing text
            recognition.start();
        }
    });
}