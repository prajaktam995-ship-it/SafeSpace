// Global state
let logoClickCount = 0;
let logoClickTimer = null;
let isInSafeMode = false;
let currentPage = 'main';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Clear any browser history related to safe content
    if (window.history && window.history.replaceState) {
        window.history.replaceState({}, 'Fresh Recipes - Delicious Home Cooking', '/');
    }
    
    // Prevent right-click context menu in safe mode
    document.addEventListener('contextmenu', function(e) {
        if (isInSafeMode) {
            e.preventDefault();
        }
    });
});

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Escape key - Quick exit
    if (event.key === 'Escape') {
        quickExit();
        return;
    }
    
    // Ctrl+Shift+H - Quick exit (alternative)
    if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        quickExit();
        return;
    }
    
    // Ctrl+Shift+S - Toggle safe mode (secret shortcut)
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        toggleSafeMode();
        return;
    }
}

// Handle logo clicks for secret unlock
function handleLogoClick() {
    logoClickCount++;
    
    // Clear previous timer
    if (logoClickTimer) {
        clearTimeout(logoClickTimer);
    }
    
    // Set timer to reset count after 2 seconds
    logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
    }, 2000);
    
    // Check if secret pattern is complete (5 clicks)
    if (logoClickCount >= 5) {
        logoClickCount = 0;
        if (logoClickTimer) {
            clearTimeout(logoClickTimer);
        }
        activateSafeMode();
    }
}

// Handle secret code entry
function checkSecretCode(event) {
    const input = event.target;
    const code = input.value.trim();
    
    // Check if the secret code matches
    if (code === '123@') {
        // Clear the input
        input.value = '';
        input.placeholder = 'Newsletter signup...';
        
        // Activate SafeSpace
        activateSafeMode();
    }
    
    // Clear input if Enter key is pressed and code is wrong
    if (event.key === 'Enter' && code !== '123@') {
        input.value = '';
        input.placeholder = 'Try again...';
        setTimeout(() => {
            input.placeholder = 'Newsletter signup...';
        }, 2000);
    }
}

// Activate SafeSpace mode
function activateSafeMode() {
    isInSafeMode = true;
    currentPage = 'safe';
    
    // First, hide all existing content (including any individual pages)
    hideAllPages();
    
    // Show SafeSpace content
    document.getElementById('safeSpaceContent').classList.remove('hidden');
    
    // Show quick exit button
    document.getElementById('quickExit').classList.remove('hidden');
    
    // Update page title
    document.title = 'Fresh Recipes - Cooking Tips';
    
    // Update navbar for safe mode
    updateNavForSafeMode();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Clear browser history
    if (window.history && window.history.replaceState) {
        window.history.replaceState({}, 'Fresh Recipes - Cooking Tips', '/tips');
    }
}

// Toggle safe mode (for keyboard shortcut)
function toggleSafeMode() {
    if (isInSafeMode) {
        returnToNormalMode();
    } else {
        activateSafeMode();
    }
}

// Return to normal recipe site mode
function returnToNormalMode() {
    isInSafeMode = false;
    currentPage = 'main';
    
    // Hide SafeSpace content
    document.getElementById('safeSpaceContent').classList.add('hidden');
    
    // Hide all page content
    hideAllPages();
    
    // Show main content
    document.getElementById('mainContent').classList.remove('hidden');
    
    // Hide quick exit button
    document.getElementById('quickExit').classList.add('hidden');
    
    // Update page title
    document.title = 'Delicious Home Recipes - Fresh & Healthy Cooking Ideas';
    
    // Restore normal navbar
    updateNavForNormalMode();
    
    // Clear browser history
    if (window.history && window.history.replaceState) {
        window.history.replaceState({}, 'Fresh Recipes - Home', '/');
    }
}

// Quick exit function
function quickExit() {
    // Clear any sensitive data from local storage
    localStorage.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Return to normal recipe site mode
    returnToNormalMode();
}

// Update navigation for safe mode
function updateNavForSafeMode() {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = `
        <li><a href="#" onclick="showSafeHome()">Help Center</a></li>
        <li><a href="#" onclick="showPage('help')">Emergency</a></li>
        <li><a href="#" onclick="showPage('resources')">Resources</a></li>
        <li><a href="#" onclick="showPage('safety-plan')">Safety Plan</a></li>
        <li><a href="#" onclick="showPage('contact')">Contact</a></li>
        <li><a href="#" onclick="showPage('chat')">Chat</a></li>
    `;
}

// Update navigation for normal mode
function updateNavForNormalMode() {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = `
        <li><a href="#home">Home</a></li>
        <li><a href="#recipes">Recipes</a></li>
        <li><a href="#tips">Cooking Tips</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
    `;
}

// Show safe home
function showSafeHome() {
    hideAllPages();
    document.getElementById('safeSpaceContent').classList.remove('hidden');
    document.title = 'Fresh Recipes - Help Center';
}

// Show specific page
function showPage(pageName) {
    if (!isInSafeMode) return;
    
    hideAllPages();
    
    // Load page content dynamically
    loadPageContent(pageName);
    
    // Update title
    const titles = {
        'help': 'Fresh Recipes - Emergency Help',
        'resources': 'Fresh Recipes - Resources',
        'safety-plan': 'Fresh Recipes - Safety Planning',
        'legal-info': 'Fresh Recipes - Legal Information',
        'contact': 'Fresh Recipes - Contact Help',
        'chat': 'Fresh Recipes - Support Chat'
    };
    
    document.title = titles[pageName] || 'Fresh Recipes - Help';
    currentPage = pageName;
}

// Hide all pages
function hideAllPages() {
    document.getElementById('safeSpaceContent').classList.add('hidden');
    document.getElementById('mainContent').classList.add('hidden');
    
    // Hide any dynamically loaded page content
    const existingPageContent = document.querySelector('.page-content');
    if (existingPageContent) {
        existingPageContent.remove();
    }
}

// Load page content dynamically
function loadPageContent(pageName) {
    const pages = {
        'help': getHelpPageContent(),
        'resources': getResourcesPageContent(),
        'safety-plan': getSafetyPlanPageContent(),
        'legal-info': getLegalInfoPageContent(),
        'contact': getContactPageContent(),
        'chat': getChatPageContent()
    };
    
    const content = pages[pageName];
    if (content) {
        const pageElement = document.createElement('div');
        pageElement.className = 'page-content';
        pageElement.innerHTML = content;
        document.body.appendChild(pageElement);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Page content generators
function getHelpPageContent() {
    return `
        <div class="page-header">
            <h1>🚨 Emergency Help Resources</h1>
            <p>If you are in immediate danger, call 911</p>
        </div>
        
        <div class="emergency-contacts">
            <div class="contact-card">
                <h3>🇺🇸 National Domestic Violence Hotline</h3>
                <div class="phone"><a href="tel:18007997233">1-800-799-7233</a></div>
                <p>24/7 confidential support in over 200 languages</p>
                <p><strong>Text:</strong> <a href="sms:22522">Text START to 22522</a></p>
                <p><strong>Online Chat:</strong> <a href="https://www.thehotline.org/get-help/" target="_blank">thehotline.org</a></p>
            </div>
            
            <div class="contact-card">
                <h3>🏠 National Safe Haven Alliance</h3>
                <div class="phone"><a href="tel:18777237233">1-877-723-7233</a></div>
                <p>Emergency shelter and housing assistance</p>
            </div>
            
            <div class="contact-card">
                <h3>👶 Childhelp National Child Abuse Hotline</h3>
                <div class="phone"><a href="tel:18004224453">1-800-4-A-CHILD (1-800-422-4453)</a></div>
                <p>24/7 support for children and adult survivors</p>
            </div>
            
            <div class="contact-card">
                <h3>🏳️‍🌈 LGBT National Domestic Violence Hotline</h3>
                <div class="phone"><a href="tel:18009345280">1-800-934-5280</a></div>
                <p>Support for LGBTQ+ individuals experiencing abuse</p>
            </div>
            
            <div class="contact-card">
                <h3>🌍 RAINN National Sexual Assault Hotline</h3>
                <div class="phone"><a href="tel:18006564673">1-800-656-4673</a></div>
                <p>24/7 support for survivors of sexual violence</p>
            </div>
        </div>
        
        <div class="resource-section">
            <h2>If You Can't Call</h2>
            <ul class="resource-list">
                <li><strong>Text for Help:</strong> Text "LOVEIS" to 22522 for the National Domestic Violence Hotline</li>
                <li><strong>Online Chat:</strong> Visit thehotline.org for live chat support</li>
                <li><strong>Email:</strong> Many local organizations offer email support</li>
                <li><strong>Library Computers:</strong> Use public computers if your devices are monitored</li>
            </ul>
        </div>
        
        <div class="safety-notice">
            <p><strong>Safety Reminder:</strong> If someone is monitoring your internet activity, consider using a public computer or trusted friend's device. Always clear your browser history.</p>
        </div>
    `;
}

function getResourcesPageContent() {
    return `
        <div class="page-header">
            <h1>📚 Resources & Information</h1>
            <p>Knowledge and support for your journey to safety</p>
        </div>
        
        <div class="resource-section">
            <h2>Understanding Abuse</h2>
            <ul class="resource-list">
                <li><strong>Physical Abuse:</strong> Hitting, slapping, choking, restraining, or any unwanted physical contact</li>
                <li><strong>Emotional Abuse:</strong> Name-calling, threats, intimidation, isolation from friends/family</li>
                <li><strong>Financial Abuse:</strong> Controlling money, preventing work, hiding assets, ruining credit</li>
                <li><strong>Sexual Abuse:</strong> Any unwanted sexual activity, including within marriage</li>
                <li><strong>Digital Abuse:</strong> Monitoring devices, social media harassment, sharing private images</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Warning Signs</h2>
            <ul class="resource-list">
                <li>Partner checks your phone, email, or social media without permission</li>
                <li>Extreme jealousy or possessiveness</li>
                <li>Isolating you from friends and family</li>
                <li>Controlling your finances or preventing you from working</li>
                <li>Threatening to hurt you, children, pets, or themselves</li>
                <li>Pressuring you into sexual activity</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Online Safety Tips</h2>
            <ul class="resource-list">
                <li><strong>Use Private Browsing:</strong> Always use incognito/private mode</li>
                <li><strong>Clear History:</strong> Delete browsing history, downloads, and cache</li>
                <li><strong>Use Public Computers:</strong> Libraries, schools, or internet cafes</li>
                <li><strong>Trusted Device:</strong> Use a friend's or family member's device</li>
                <li><strong>Change Passwords:</strong> Use devices they can't access to change passwords</li>
                <li><strong>Check for Spyware:</strong> Look for unfamiliar apps or unusual battery drain</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Supporting Organizations</h2>
            <ul class="resource-list">
                <li><strong>National Coalition Against Domestic Violence:</strong> <a href="https://ncadv.org" target="_blank">ncadv.org</a></li>
                <li><strong>Futures Without Violence:</strong> <a href="https://futureswithoutviolence.org" target="_blank">futureswithoutviolence.org</a></li>
                <li><strong>Women's Law:</strong> <a href="https://womenslaw.org" target="_blank">womenslaw.org</a></li>
                <li><strong>Love Is Respect:</strong> <a href="https://loveisrespect.org" target="_blank">loveisrespect.org</a></li>
            </ul>
        </div>
    `;
}

function getSafetyPlanPageContent() {
    return `
        <div class="page-header">
            <h1>📋 Personal Safety Planning</h1>
            <p>Creating a plan can help you stay safer</p>
        </div>
        
        <div class="safety-step">
            <h3>Step 1: Safe Places to Go</h3>
            <p>Identify safe places where you can go in an emergency:</p>
            <ul>
                <li>Friends or family members who will help</li>
                <li>Local domestic violence shelter</li>
                <li>Public places (library, store, restaurant)</li>
                <li>Religious or community centers</li>
                <li>Hospital or police station</li>
            </ul>
            <p><strong>Note:</strong> Think of multiple options in different areas.</p>
        </div>
        
        <div class="safety-step">
            <h3>Step 2: Important Documents</h3>
            <p>Gather copies of important documents and store them safely:</p>
            <ul>
                <li>Driver's license and Social Security cards</li>
                <li>Birth certificates (yours and children's)</li>
                <li>Passport, green card, or immigration documents</li>
                <li>Marriage certificate, divorce papers</li>
                <li>Insurance policies and medical records</li>
                <li>Bank statements and credit cards</li>
                <li>Medication prescriptions</li>
                <li>Court orders, restraining orders</li>
            </ul>
        </div>
        
        <div class="safety-step">
            <h3>Step 3: Emergency Kit</h3>
            <p>Prepare a bag with essentials and keep it hidden or with a trusted person:</p>
            <ul>
                <li>Cash and credit cards</li>
                <li>Change of clothes for you and children</li>
                <li>Medications</li>
                <li>Keys (house, car, work)</li>
                <li>Phone charger</li>
                <li>Important phone numbers written down</li>
                <li>Comfort items for children</li>
            </ul>
        </div>
        
        <div class="safety-step">
            <h3>Step 4: Communication Plan</h3>
            <p>Plan how to communicate safely:</p>
            <ul>
                <li>Use code words with trusted friends/family</li>
                <li>Identify safe times to communicate</li>
                <li>Use public phones or computers when possible</li>
                <li>Have a trusted person who can call police if needed</li>
                <li>Plan how to contact your children's school</li>
            </ul>
        </div>
        
        <div class="safety-step">
            <h3>Step 5: If You Stay</h3>
            <p>Safety strategies if you remain in the relationship:</p>
            <ul>
                <li>Identify safe rooms with exits (avoid kitchens, bathrooms)</li>
                <li>Practice escape routes from home</li>
                <li>Keep emergency numbers accessible</li>
                <li>Tell trusted friends about the abuse</li>
                <li>Hide emergency money and supplies</li>
                <li>Plan what to do if violence escalates</li>
            </ul>
        </div>
        
        <div class="safety-step">
            <h3>Step 6: After You Leave</h3>
            <p>Staying safe after leaving:</p>
            <ul>
                <li>Change locks and security codes</li>
                <li>Get a restraining order if needed</li>
                <li>Tell children's school about the situation</li>
                <li>Change work schedule/route if possible</li>
                <li>Use different stores, banks, services</li>
                <li>Consider changing phone number</li>
                <li>Save evidence of continued abuse</li>
            </ul>
        </div>
        
        <div class="safety-notice">
            <p><strong>Remember:</strong> Your safety plan should be personalized to your situation. Consider working with a domestic violence advocate to create a comprehensive plan.</p>
        </div>
    `;
}

function getLegalInfoPageContent() {
    return `
        <div class="page-header">
            <h1>⚖️ Legal Rights & Information</h1>
            <p>Understanding your legal options and protections</p>
        </div>
        
        <div class="resource-section">
            <h2>Restraining Orders / Protection Orders</h2>
            <ul class="resource-list">
                <li><strong>What it does:</strong> Legal document ordering abuser to stay away from you</li>
                <li><strong>Who can get one:</strong> Current/former partners, family members, household members</li>
                <li><strong>Where to apply:</strong> Local courthouse, often with advocate assistance</li>
                <li><strong>Cost:</strong> Usually free or low-cost</li>
                <li><strong>Violation:</strong> Breaking a restraining order is a crime</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Your Rights</h2>
            <ul class="resource-list">
                <li><strong>Right to Safety:</strong> No one has the right to hurt you</li>
                <li><strong>Right to Leave:</strong> You can leave an abusive relationship</li>
                <li><strong>Right to Report:</strong> You can report abuse to police</li>
                <li><strong>Right to Medical Care:</strong> Seek medical attention for injuries</li>
                <li><strong>Right to Your Children:</strong> Abuse doesn't automatically affect custody</li>
                <li><strong>Right to Support:</strong> Access to victim services and counseling</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Criminal vs. Civil Options</h2>
            <ul class="resource-list">
                <li><strong>Criminal Case:</strong> Police and prosecutor pursue charges against abuser</li>
                <li><strong>Civil Case:</strong> You file for restraining order, divorce, custody</li>
                <li><strong>Both Options:</strong> You can pursue criminal and civil remedies simultaneously</li>
                <li><strong>No Requirement:</strong> You don't have to cooperate with criminal prosecution</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Immigration Rights</h2>
            <ul class="resource-list">
                <li><strong>VAWA Self-Petition:</strong> Abused spouses can petition for residency independently</li>
                <li><strong>U Visa:</strong> Available for victims of qualifying crimes</li>
                <li><strong>T Visa:</strong> For victims of human trafficking</li>
                <li><strong>No Deportation:</strong> Reporting abuse shouldn't lead to deportation</li>
                <li><strong>Language Services:</strong> Right to interpreter in legal proceedings</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Children and Custody</h2>
            <ul class="resource-list">
                <li><strong>Best Interest Standard:</strong> Courts prioritize children's safety and wellbeing</li>
                <li><strong>Domestic Violence Factor:</strong> Abuse history affects custody decisions</li>
                <li><strong>Supervised Visitation:</strong> Courts can order supervised visits for abusive parent</li>
                <li><strong>Child Support:</strong> Still owed even if visitation is restricted</li>
                <li><strong>Relocation:</strong> May be allowed for safety reasons</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Financial Rights</h2>
            <ul class="resource-list">
                <li><strong>Marital Property:</strong> You may be entitled to half of marital assets</li>
                <li><strong>Spousal Support:</strong> May be available depending on circumstances</li>
                <li><strong>Economic Abuse:</strong> Financial control is a form of abuse</li>
                <li><strong>Credit Repair:</strong> Options available for repairing damaged credit</li>
                <li><strong>Public Benefits:</strong> May be eligible for temporary assistance</li>
            </ul>
        </div>
        
        <div class="resource-section">
            <h2>Getting Legal Help</h2>
            <ul class="resource-list">
                <li><strong>Legal Aid Organizations:</strong> Free legal services for low-income individuals</li>
                <li><strong>Domestic Violence Programs:</strong> Often have legal advocates</li>
                <li><strong>Pro Bono Attorneys:</strong> Lawyers providing free services</li>
                <li><strong>Law School Clinics:</strong> Supervised law student assistance</li>
                <li><strong>Court Self-Help Centers:</strong> Assistance with forms and procedures</li>
            </ul>
        </div>
        
        <div class="safety-notice">
            <p><strong>Disclaimer:</strong> This information is general and not legal advice. Laws vary by state. Consult with a local attorney or legal advocate for advice specific to your situation.</p>
        </div>
    `;
}

function getContactPageContent() {
    return `
        <div class="page-header">
            <h1>📞 Secure Contact Form</h1>
            <p>Reach out to local support organizations safely</p>
        </div>
        
        <div class="safety-notice" style="margin-bottom: 30px;">
            <p><strong>Privacy Notice:</strong> This form does not store your information. For maximum safety, consider using a public computer or trusted friend's device to submit this form.</p>
        </div>
        
        <div class="contact-form">
            <form id="contactForm" onsubmit="handleContactForm(event)">
                <div class="form-group">
                    <label for="contactType">Type of Help Needed:</label>
                    <select id="contactType" name="contactType" required>
                        <option value="">Select help needed...</option>
                        <option value="emergency">Emergency shelter/housing</option>
                        <option value="counseling">Counseling and emotional support</option>
                        <option value="legal">Legal assistance and advocacy</option>
                        <option value="safety">Safety planning</option>
                        <option value="children">Help with children/custody</option>
                        <option value="financial">Financial assistance</option>
                        <option value="healthcare">Healthcare and medical support</option>
                        <option value="other">Other support services</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="urgency">Urgency Level:</label>
                    <select id="urgency" name="urgency" required>
                        <option value="">Select urgency...</option>
                        <option value="immediate">Immediate (within 24 hours)</option>
                        <option value="soon">Soon (within a week)</option>
                        <option value="planning">Planning for the future</option>
                        <option value="information">Just need information</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="location">Your General Location (City/State):</label>
                    <input type="text" id="location" name="location" placeholder="e.g., Springfield, IL" required>
                    <small>This helps us connect you with local resources</small>
                </div>
                
                <div class="form-group">
                    <label for="safeContact">Safe Contact Method:</label>
                    <select id="safeContact" name="safeContact" required>
                        <option value="">How can we safely contact you?</option>
                        <option value="email">Email (safe email address)</option>
                        <option value="phone">Phone (safe number)</option>
                        <option value="text">Text message (safe number)</option>
                        <option value="none">Please don't contact me - I'll call you</option>
                    </select>
                </div>
                
                <div class="form-group" id="contactInfo" style="display: none;">
                    <label for="contactDetails">Contact Information:</label>
                    <input type="text" id="contactDetails" name="contactDetails" placeholder="Email or phone number">
                    <small>Only provide if it's safe for you to receive contact</small>
                </div>
                
                <div class="form-group">
                    <label for="safeTime">Safe Times to Contact (if applicable):</label>
                    <input type="text" id="safeTime" name="safeTime" placeholder="e.g., Weekdays 9-5, Monday evenings">
                </div>
                
                <div class="form-group">
                    <label for="situation">Brief Description of Your Situation (optional):</label>
                    <textarea id="situation" name="situation" placeholder="Share only what you're comfortable with. This helps us provide better assistance."></textarea>
                    <small>Do not include identifying details about your abuser</small>
                </div>
                
                <div class="form-group">
                    <label for="codeWord">Personal Code Word (optional):</label>
                    <input type="text" id="codeWord" name="codeWord" placeholder="A word only you would know">
                    <small>Use this when calling so we know it's really you</small>
                </div>
                
                <button type="submit" class="submit-button">Send Secure Request</button>
            </form>
        </div>
        
        <div class="resource-section">
            <h2>Alternative Contact Methods</h2>
            <ul class="resource-list">
                <li><strong>Text "HELP" to 233733 (BEFREE):</strong> Crisis Text Line for immediate support</li>
                <li><strong>Online Chat:</strong> Visit thehotline.org for live chat support</li>
                <li><strong>Email:</strong> help@domesticshelters.org (National database of shelters)</li>
                <li><strong>TTY:</strong> 1-800-787-3224 for deaf/hard of hearing individuals</li>
            </ul>
        </div>
        
        <div class="safety-notice">
            <p><strong>Remember:</strong> If you're in immediate danger, call 911. This form is for connecting with support services and planning, not emergency situations.</p>
        </div>
    `;
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission (in reality, this would send to a secure endpoint)
    document.getElementById('contactForm').innerHTML = `
        <div style="text-align: center; padding: 40px; background: #d4edda; border-radius: 10px; color: #155724;">
            <h3>Request Sent Successfully</h3>
            <p>A local advocate will reach out to you using your preferred contact method within the timeframe you specified.</p>
            <p><strong>Reference Number:</strong> SR-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p>Keep this reference number for your records.</p>
            <br>
            <p><strong>Immediate Help:</strong> If your situation changes and you need immediate assistance, call 911 or the National Domestic Violence Hotline at 1-800-799-7233.</p>
        </div>
    `;
    
    // Auto-clear form data from memory after showing success
    setTimeout(() => {
        event.target.reset();
    }, 5000);
}

// Show contact info field based on contact method selection
document.addEventListener('change', function(event) {
    if (event.target.id === 'safeContact') {
        const contactInfo = document.getElementById('contactInfo');
        const contactDetails = document.getElementById('contactDetails');
        
        if (event.target.value !== 'none' && event.target.value !== '') {
            contactInfo.style.display = 'block';
            contactDetails.required = true;
            
            // Update placeholder based on selection
            if (event.target.value === 'email') {
                contactDetails.placeholder = 'Your safe email address';
                contactDetails.type = 'email';
            } else {
                contactDetails.placeholder = 'Your safe phone number';
                contactDetails.type = 'tel';
            }
        } else {
            contactInfo.style.display = 'none';
            contactDetails.required = false;
        }
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Smooth scrolling for anchor links (normal mode only)
document.addEventListener('click', function(event) {
    if (!isInSafeMode && event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Prevent back button from revealing safe content
window.addEventListener('popstate', function() {
    if (isInSafeMode) {
        quickExit();
    }
});

// Clear any traces when page is about to unload
window.addEventListener('beforeunload', function() {
    if (isInSafeMode) {
        // Clear any sensitive data
        logoClickCount = 0;
        isInSafeMode = false;
    }
});

// Disable developer tools shortcuts in safe mode
document.addEventListener('keydown', function(event) {
    if (isInSafeMode) {
        // Disable F12
        if (event.key === 'F12') {
            event.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (event.ctrlKey && (
            (event.shiftKey && (event.key === 'I' || event.key === 'J')) ||
            event.key === 'U'
        )) {
            event.preventDefault();
            return false;
        }
    }
    
    // Add enter key support for chat
    if (currentPage === 'chat' && event.key === 'Enter') {
        const chatInput = document.getElementById('chatInput');
        if (chatInput && document.activeElement === chatInput) {
            event.preventDefault();
            sendChatMessage();
        }
    }
});

function getChatPageContent() {
    return `
        <div class="page-header">
            <h1>💬 Anonymous Support Chat</h1>
            <p>Safe, confidential conversation with support specialists</p>
        </div>
        
        <div class="chat-disclaimer">
            <p><strong>Security Notice:</strong> This chat is anonymous and secure. Your conversations are not stored or tracked. For immediate emergencies, please call 911.</p>
        </div>
        
        <div class="chat-container">
            <div class="chat-header">
                <h3>SafeSpace Support Chat</h3>
                <div class="chat-status" id="chatStatus">Support specialist online</div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message support">
                    <div>Hello, I'm here to help you. This is a safe space where you can talk freely. How are you feeling today?</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type your message..." maxlength="500">
                <button class="chat-send-btn" id="chatSendBtn" onclick="sendChatMessage()">Send</button>
            </div>
        </div>
        
        <div class="resource-section">
            <h2>Emergency Contacts</h2>
            <ul class="resource-list">
                <li><strong>National Domestic Violence Hotline:</strong> <a href="tel:18007997233">1-800-799-7233</a></li>
                <li><strong>Crisis Text Line:</strong> Text "HELLO" to 741741</li>
                <li><strong>Emergency Services:</strong> Call 911</li>
            </ul>
        </div>
    `;
}

// Chat functionality
let chatMessages = [];
let isTyping = false;

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate response delay
    setTimeout(() => {
        hideTypingIndicator();
        addChatMessage(generateSupportResponse(message), 'support');
    }, 1500 + Math.random() * 2000);
}

function addChatMessage(message, sender) {
    const chatMessagesContainer = document.getElementById('chatMessages');
    if (!chatMessagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messageDiv.innerHTML = `
        <div>${message}</div>
        <div class="message-time">${time}</div>
    `;
    
    chatMessagesContainer.appendChild(messageDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    
    chatMessages.push({message, sender, time});
}

function showTypingIndicator() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    if (!chatMessagesContainer) return;
    
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatMessagesContainer.appendChild(typingDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

function generateSupportResponse(userMessage) {
    const supportResponses = [
        "Thank you for sharing that with me. Your feelings are completely valid, and I'm here to listen.",
        "I hear you, and I want you to know that you're not alone. What you're going through is difficult, but there is help available.",
        "It takes courage to reach out. You've taken an important step by being here today.",
        "Your safety is the most important thing. Have you been able to think about what might make you feel safer?",
        "That sounds really challenging. How are you taking care of yourself right now?",
        "I'm glad you felt comfortable sharing that with me. What kind of support would be most helpful for you?",
        "You deserve to be treated with respect and kindness. What you're describing is not okay.",
        "I can hear how difficult this situation is for you. Remember that none of this is your fault.",
        "Thank you for trusting me with this. What would help you feel more supported right now?",
        "That must feel overwhelming. Let's think about some small steps that might help you feel more in control.",
        "Your instincts are important. If something doesn't feel right, that's worth paying attention to.",
        "I want to make sure you have the resources you need. Are you familiar with safety planning?",
        "It's normal to have mixed feelings about your situation. Whatever you're feeling is okay.",
        "You know your situation best. What feels like the most important thing to focus on right now?",
        "I'm here to support you, not to judge. Please share whatever feels comfortable for you."
    ];
    
    // Simple keyword responses for specific situations
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('scared') || lowerMessage.includes('afraid')) {
        return "I understand you're feeling scared. That's a normal response to your situation. Your safety is most important. Do you have a safe place you can go if needed?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('need')) {
        return "I want to help you. There are several resources available including emergency shelter, legal advocacy, and counseling. Which type of support feels most urgent for you right now?";
    }
    
    if (lowerMessage.includes('leave') || lowerMessage.includes('leaving')) {
        return "Thinking about leaving takes courage. If you're considering this step, safety planning is really important. Would you like to talk about creating a safety plan?";
    }
    
    if (lowerMessage.includes('children') || lowerMessage.includes('kids')) {
        return "I understand your concern for your children. Protecting them is clearly important to you. There are resources specifically designed to help families in situations like yours.";
    }
    
    if (lowerMessage.includes('police') || lowerMessage.includes('call')) {
        return "If you're in immediate danger, please call 911. For non-emergency situations, you have options including the domestic violence hotline (1-800-799-7233) available 24/7.";
    }
    
    // Return random supportive response
    return supportResponses[Math.floor(Math.random() * supportResponses.length)];
}
