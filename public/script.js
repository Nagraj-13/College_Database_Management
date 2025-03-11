document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    // lucide.createIcons();
  
    // Fetch academic data
    fetchAcademicData();
  });
  
  async function fetchAcademicData() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/user/academics', {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjVjOWNlNmIzYTQ1ZTYxNTRkY2UzNiIsImlhdCI6MTczMTEzOTU1NSwiZXhwIjoxNzMzNzMxNTU1fQ.YI8bWSnaB5Laao__FgcW1N1U-BdzlqH23Z9hE3U2Gpc',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data && data.payload && data.payload.academicDetails) {
        updateUserName(data.payload.name || 'User');
        displayAcademicData(data.payload.academicDetails.semesters);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  function updateUserName(name) {
    document.getElementById('userName').textContent = name;
  }
  
  function displayAcademicData(semesters) {
    const academicTablesContainer = document.getElementById('academicTables');
    academicTablesContainer.innerHTML = '';
  
    semesters.forEach(semester => {
      const table = createAcademicTable(semester);
      academicTablesContainer.appendChild(table);
    });
  }
  
  function createAcademicTable(semester) {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'overflow-x-auto';
  
    const table = document.createElement('table');
    table.className = 'academic-table';
  
    const caption = document.createElement('caption');
    caption.textContent = `Semester ${semester.sem}`;
    caption.className = 'text-xl font-semibold mb-2 text-blue-600';
    table.appendChild(caption);
  
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Subject Code</th>
        <th>Subject Name</th>
        <th>Credits</th>
        <th>Actions</th>
      </tr>
    `;
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
    semester.subjects.forEach((subject, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Subject Code">${subject.subCode}</td>
        <td data-label="Subject Name">${subject.subName}</td>
        <td data-label="Credits">${subject.subCredits}</td>
        <td data-label="Actions">
          <button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="openUpdateForm(${index}, ${semester.sem}, '${subject.subCode}', '${subject.subName}', ${subject.subCredits})">Edit</button>
        </td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  
    tableContainer.appendChild(table);
    return tableContainer;
  }
  
  function openUpdateForm(index, semester, subCode, subName, subCredits) {
    document.getElementById('subjectCode').value = subCode;
    document.getElementById('subjectName').value = subName;
    document.getElementById('subjectCredits').value = subCredits;
    document.getElementById('semester').value = semester;
    
    const updateForm = document.getElementById('updateSubjectForm');
    updateForm.onsubmit = function(e) {
      e.preventDefault();
      const marks = document.getElementById('marks').value;
      updateSubject(index, {
        subCode: document.getElementById('subjectCode').value,
        subName: document.getElementById('subjectName').value,
        subCredits: document.getElementById('subjectCredits').value,
        semester: semester,
        marks: marks
      });
    };
  
    document.getElementById('updateSubjectContainer').classList.remove('hidden');
  }
  
  async function updateSubject(index, updatedSubject) {
    // Update the subject on the backend
    try {
      const response = await fetch('http://localhost:5000/api/v1/user/updateSubject', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN_HERE',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSubject)
      });
  
      if (response.ok) {
        // Optionally, refresh the academic data to reflect changes
        fetchAcademicData();
        document.getElementById('updateSubjectContainer').classList.add('hidden');
      } else {
        console.error('Failed to update subject');
      }
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  }
  