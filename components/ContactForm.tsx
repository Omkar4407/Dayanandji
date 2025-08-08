import React, { useState } from 'react';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showEmailContent, setShowEmailContent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createEmailContent = () => {
    const emailSubject = `Inquiry through Website Contact Form: ${formData.subject}`;
    const emailBody = `
Name: ${formData.name}
Phone: ${formData.phone || 'Not provided'}
Area: ${formData.area || 'Not provided'}
Topic: ${formData.subject}
Message:
${formData.message} 

---
This Message was sent by ${formData.name} through the NEWays Bharat Federation Website Contact Form.
    `.trim();

    return { subject: emailSubject, body: emailBody };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowEmailContent(false);
    
    try {
      // Create the email content
      const { subject, body } = createEmailContent();
      
      // Method 1: Try to open Gmail compose directly
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=khushi@adsmagnify.in&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      console.log('Opening Gmail compose...');
      const gmailWindow = window.open(gmailUrl, '_blank');
      
      if (gmailWindow) {
        console.log('Gmail compose opened successfully');
        setSubmitStatus('success');
        
        // Show email content as backup
        setTimeout(() => {
          setShowEmailContent(true);
        }, 1000);
        
        // Reset form after delay
        setTimeout(() => {
          setFormData({
            name: '',
            phone: '',
            area: '',
            subject: '',
            message: ''
          });
          setIsSubmitting(false);
          setSubmitStatus('idle');
          setShowEmailContent(false);
        }, 10000);
      } else {
        // Fallback: Show email content directly
        console.log('Gmail compose failed, showing email content');
        setSubmitStatus('success');
        setShowEmailContent(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setSubmitStatus('error');
      setShowEmailContent(true);
      setIsSubmitting(false);
    }
  };

  const copyEmailContent = () => {
    const { subject, body } = createEmailContent();
    const emailContent = `To: khushi@adsmagnify.in\nSubject: ${subject}\n\n${body}`;
    
    navigator.clipboard.writeText(emailContent).then(() => {
      alert('✓ Email content copied to clipboard!\n\nPlease paste this into your email client and send it to khushi@adsmagnify.in');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✓ Email content copied to clipboard!\n\nPlease paste this into your email client and send it to khushi@adsmagnify.in');
    });
  };

  const openGmailCompose = () => {
    const { subject, body } = createEmailContent();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=khushi@adsmagnify.in&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  const openOutlookCompose = () => {
    const { subject, body } = createEmailContent();
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=khushi@adsmagnify.in&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(outlookUrl, '_blank');
  };

  return (
    <div className={`bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg ${className}`} data-aos="fade-up" data-aos-duration="800">
      <h3 className="text-2xl sm:text-3xl font-semibold text-fun-blue mb-6 sm:mb-8" data-aos="fade-up" data-aos-delay="200">Send Us a Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div data-aos="fade-up" data-aos-delay="300">
          <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fun-blue focus:border-fun-blue transition-colors duration-300 text-sm sm:text-base"
            placeholder="Enter your full name"
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="400">
          <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fun-blue focus:border-fun-blue transition-colors duration-300 text-sm sm:text-base"
            placeholder="Enter your phone number"
          />
        </div>
        
        <div data-aos="fade-up" data-aos-delay="500">
          <label htmlFor="area" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Area of Residence *
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fun-blue focus:border-fun-blue transition-colors duration-300 text-sm sm:text-base"
            placeholder="Enter your area of residence"
          />
        </div>
        
     
        {<div data-aos="fade-up" data-aos-delay="600">
          <label htmlFor="subject" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            What would you like to know about? *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fun-blue focus:border-fun-blue transition-colors duration-300 text-sm sm:text-base"
          >
            <option value="">Select a topic</option>
            <option value="To Volunteer In Organization">How can I volunteer with your organization?</option>
            <option value="To Donate Or Support">How can I donate or support your cause?</option>
            <option value="To Know More About Programs">What programs do you currently run?</option>
            <option value="To Partner with Us">Partnership and collaboration opportunities</option>
            <option value="To Understand Our Impact">How can I see the impact of your work?</option>
            <option value="Other Personalised Queries">Other questions</option>
          </select>
        </div>}
        
        <div data-aos="fade-up" data-aos-delay="700">
          <label htmlFor="message" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fun-blue focus:border-fun-blue transition-colors duration-300 resize-vertical text-sm sm:text-base"
            placeholder="Please share your question or message in detail..."
          ></textarea>
        </div>
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-medium">✓ Gmail compose should have opened!</p>
            <p className="text-sm mt-1">
              Check if Gmail opened in a new tab. If not, use the options below to send your message.
            </p>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">⚠ Could not open email compose</p>
            <p className="text-sm mt-1">Please use the manual options below to send your message.</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-fun-blue text-white hover:bg-tory-blue'
          }`}
          data-aos="fade-up" 
          data-aos-delay="800"
        >
          {isSubmitting ? 'Opening Gmail Compose...' : 'Send Message via Gmail'}
        </button>
      </form>
      
      {/* Email Options */}
      {showEmailContent && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">📧 Email Options</h4>
          <p className="text-sm text-blue-700 mb-4">
            Choose how you'd like to send your message:
          </p>
          
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={openGmailCompose}
              className="w-full bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              📧 Open Gmail Compose
            </button>
            
            <button
              onClick={openOutlookCompose}
              className="w-full bg-blue-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              📧 Open Outlook Compose
            </button>
            
            <button
              onClick={copyEmailContent}
              className="w-full bg-green-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              📋 Copy Email Content
            </button>
            
            <a
              href="mailto:khushi@adsmagnify.in"
              className="block w-full bg-purple-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors duration-300 text-center text-sm sm:text-base"
            >
              📧 Open Default Email Client
            </a>
          </div>
        </div>
      )}
      
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-cerulean/10 rounded-lg border-l-4 border-fun-blue">
        <p className="text-sm text-gray-600">
          <strong>How it works:</strong> Click "Send Message" to open Gmail compose with your message pre-filled. 
          If Gmail doesn't open, use the manual options above. You can also contact us directly at <a href="mailto:neways008@gmail.com" className="text-fun-blue hover:underline">neways008@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default ContactForm;
