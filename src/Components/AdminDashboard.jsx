import React, { useState, useEffect } from 'react';
import "./css/AdminDashboard.css";
import Navbar from './Navbar';
function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetching courses
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/courses');
      const data = await response.json();
      console.log(data); // Log data to check for course_id field
      if (response.ok) {
        setCourses(data);
        setError(null);
      } else {
        setError('Failed to fetch courses.');
      }
    } catch (err) {
      setError('Error fetching courses.');
    }
  };

  // Handle course deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/courses/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorMessage = `Failed to delete course. Status: ${response.status}`;
          console.error(errorMessage);
          setError(errorMessage);
        } else {
          setError(null);
          fetchCourses();
        }
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Error deleting course.');
      }
    }
  };

  // Handle editing course
  const handleEdit = (course) => {
    console.log(course); // Log course to verify that course_id exists
    setEditingCourse({ ...course });
  };

  // Handle adding a new course
  const handleAddNew = () => {
    setEditingCourse({
      course_name: '',
      description: '',
      instructor: '',
      price: '',
      p_link: '',
      y_link: '',
    });
  };

  // Handle updating a course (Add/Update)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      const method = editingCourse.course_id ? 'PUT' : 'POST';
      const url = editingCourse.course_id
        ? `http://localhost:8080/api/admin/courses/${editingCourse.course_id}`
        : 'http://localhost:8080/api/admin/courses';

      try {
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCourse), // Ensure course_id is part of this
        });

        if (response.ok) {
          setEditingCourse(null);
          fetchCourses();
        } else {
          setError('Failed to save course.');
        }
      } catch (err) {
        setError('Error saving course.');
      }
    }
  };

  return (<div>

<Navbar page={"home"} />
    <div className="admin-dashboard">
      <h2>Course Management</h2>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      <button className="add-course-btn" onClick={handleAddNew}>Add New Course</button>

      <table className="course-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Price</th>
            <th>Ations</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id}>
              <td>
              <td>
  <div
    className="thumbnail-wrapper"
    style={{ 
      backgroundImage: `url(${course.p_link})`,
      backgroundSize: 'cover',  // Ensures the image covers the entire div
      backgroundPosition: 'center',  // Centers the image
      height: '200px',  // Make the div taller (or adjust to your preferred size)
      width: '400px'    // Adjust the width as needed
    }}
  ></div>
</td>
   </td>
              <td>{course.course_name}</td>
              <td>{course.instructor}</td>
              <td>${course.price}</td>
              <td>
                <button onClick={() => handleEdit(course)}>Edit</button>
                <button onClick={() => handleDelete(course.course_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing or adding new course */}
      {editingCourse && (
        <>
          <div className="modal-overlay" onClick={() => setEditingCourse(null)}></div>
          <div className="modal">
            <form onSubmit={handleUpdate}>
              <h3>{editingCourse.course_id ? 'Edit Course' : 'Add New Course'}</h3>
              <label>Course Name</label>
              <input
                type="text"
                value={editingCourse.course_name || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, course_name: e.target.value })}
                required
              />
              <label>Description</label>
              <textarea
                value={editingCourse.description || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                required
              />
              <label>Instructor</label>
              <input
                type="text"
                value={editingCourse.instructor || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                required
              />
              <label>Price</label>
              <input
                type="number"
                value={editingCourse.price || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                required
              />
              <label>Thumbnail URL</label>
              <input
                type="text"
                value={editingCourse.p_link || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, p_link: e.target.value })}
                required
              />
              <label>Video URL</label>
              <input
                type="text"
                value={editingCourse.y_link || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, y_link: e.target.value })}
                required
              />
              <button type="submit">Save Changes</button>
              <button className="cancel" onClick={() => setEditingCourse(null)}>Cancel</button>
            </form>
          </div>
        </>
      )}
    </div></div>
  );
}

export default AdminDashboard;
