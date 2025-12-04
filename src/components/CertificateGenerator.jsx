import React from 'react';
import { Award, Download } from 'lucide-react';

const CertificateGenerator = ({ studentName, courseName, grade, completionDate, onDownload }) => {
    const generateCertificate = () => {
        // Create a new window for printing/downloading
        const printWindow = window.open('', '_blank');

        const certificateHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion - ${courseName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4 landscape;
            margin: 0;
        }
        
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .certificate-container {
            background: white;
            width: 297mm;
            height: 210mm;
            box-shadow: 0 10px 50px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
        }
        
        .certificate-border {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 8px solid #667eea;
            border-radius: 8px;
        }
        
        .certificate-border::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 2px solid #764ba2;
            border-radius: 4px;
        }
        
        .certificate-content {
            position: relative;
            z-index: 1;
            padding: 60px 80px;
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .certificate-header {
            margin-bottom: 30px;
        }
        
        .certificate-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        
        .certificate-icon svg {
            width: 50px;
            height: 50px;
            color: white;
        }
        
        .certificate-title {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }
        
        .certificate-subtitle {
            font-size: 18px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        .certificate-body {
            margin: 40px 0;
        }
        
        .awarded-to {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .student-name {
            font-size: 42px;
            font-weight: bold;
            color: #333;
            margin-bottom: 25px;
            border-bottom: 2px solid #667eea;
            display: inline-block;
            padding-bottom: 10px;
        }
        
        .certificate-text {
            font-size: 18px;
            color: #555;
            line-height: 1.8;
            margin-bottom: 20px;
        }
        
        .course-name {
            font-size: 28px;
            font-weight: bold;
            color: #764ba2;
            margin: 20px 0;
        }
        
        .grade-section {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            letter-spacing: 1px;
        }
        
        .certificate-footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
        }
        
        .signature-block {
            text-align: center;
            min-width: 200px;
        }
        
        .signature-line {
            border-top: 2px solid #333;
            margin-bottom: 10px;
            padding-top: 5px;
        }
        
        .signature-label {
            font-size: 14px;
            color: #666;
            font-style: italic;
        }
        
        .completion-date {
            font-size: 16px;
            color: #666;
            margin-top: 20px;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(102, 126, 234, 0.05);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .certificate-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="watermark">CERTIFIED</div>
        <div class="certificate-border"></div>
        <div class="certificate-content">
            <div class="certificate-header">
                <div class="certificate-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                </div>
                <h1 class="certificate-title">CERTIFICATE</h1>
                <p class="certificate-subtitle">Of Completion</p>
            </div>
            
            <div class="certificate-body">
                <p class="awarded-to">This is to certify that</p>
                <h2 class="student-name">${studentName}</h2>
                <p class="certificate-text">
                    has successfully completed the course
                </p>
                <h3 class="course-name">${courseName}</h3>
                <p class="certificate-text">
                    with all required quizzes and assignments completed
                </p>
                <div class="grade-section">
                    Grade Achieved: ${grade}
                </div>
            </div>
            
            <div class="certificate-footer">
                <div class="signature-block">
                    <div class="signature-line">Course Instructor</div>
                    <p class="signature-label">Authorized Signature</p>
                </div>
                <div class="signature-block">
                    <p class="completion-date">${completionDate}</p>
                    <p class="signature-label">Date of Completion</p>
                </div>
                <div class="signature-block">
                    <div class="signature-line">Academic Director</div>
                    <p class="signature-label">Authorized Signature</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-print when page loads
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>
        `;

        printWindow.document.write(certificateHTML);
        printWindow.document.close();

        if (onDownload) {
            onDownload();
        }
    };

    return (
        <button
            onClick={generateCertificate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm shadow-md"
        >
            <Award className="w-4 h-4" />
            Download Certificate
        </button>
    );
};

export default CertificateGenerator;
