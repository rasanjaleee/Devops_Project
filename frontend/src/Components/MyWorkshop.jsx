import React, { useState, useEffect } from 'react';


const getMyEnrollments = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/enrollments/my-enrollments', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch enrollments');
  return response.json();
};

const cancelEnrollment = async (workshopId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/enrollments/${workshopId}/enroll`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to cancel enrollment');
  return response.json();
};

const updateEnrollmentProgress = async (workshopId, progress, completed = false) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/enrollments/${workshopId}/progress`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ progress, completed })
  });
  if (!response.ok) throw new Error('Failed to update progress');
  return response.json();
};


const MyWorkshops = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMyEnrollments();
      console.log('My enrollments:', response);
      
      
      const enrollmentsData = response.enrollments || response.data || response;
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setError('Failed to fetch your enrolled workshops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (workshopId) => {
    if (!window.confirm('Are you sure you want to cancel this enrollment?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [workshopId]: true }));
      await cancelEnrollment(workshopId);
      
      
      setEnrollments(prev => prev.filter(enrollment => 
        enrollment.workshop?._id !== workshopId && enrollment.workshopId !== workshopId
      ));
      
      alert('Enrollment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      alert('Failed to cancel enrollment. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [workshopId]: false }));
    }
  };

  const handleProgressUpdate = async (workshopId, currentProgress) => {
  const newProgress = Math.min(currentProgress + 10, 100); // Increment by 10%
  const completed = newProgress === 100;

  try {
    setActionLoading(prev => ({ ...prev, [`progress-${workshopId}`]: true }));
    await updateEnrollmentProgress(workshopId, newProgress, completed);

    setEnrollments(prev => prev.map(enrollment => {
      const id = enrollment.workshop?._id || enrollment.workshopId;
      if (id === workshopId) {
        return {
          ...enrollment,
          progress: newProgress,
          completed,
          completedAt: completed ? new Date().toISOString() : null
        };
      }
      return enrollment;
    }));

    alert('Progress updated successfully!');
  } catch (error) {
    console.error('Error updating progress:', error);
    alert('Failed to update progress. Please try again.');
  } finally {
    setActionLoading(prev => ({ ...prev, [`progress-${workshopId}`]: false }));
  }
};


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (enrollment) => {
    if (enrollment.completed) {
      return <span className="badge bg-success">✅ Completed</span>;
    }
    if (enrollment.progress > 0) {
      return <span className="badge bg-info">🔄 In Progress ({enrollment.progress}%)</span>;
    }
    return <span className="badge bg-warning">📚 Enrolled</span>;
  };

  const getWorkshopData = (enrollment) => {
    
    return enrollment.workshop || enrollment.workshopData || {
      _id: enrollment.workshopId,
      title: enrollment.workshopTitle || 'Workshop Title',
      description: enrollment.workshopDescription || 'No description available',
      category: enrollment.category,
      instructor: enrollment.instructor,
      startDate: enrollment.startDate,
      duration: enrollment.duration,
      image: enrollment.image
    };
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your enrolled workshops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">❌ Error</h4>
            <p>{error}</p>
            <button onClick={fetchMyEnrollments} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
     
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark">My Enrolled Workshops</h1>
        <p className="lead text-muted">Track your learning journey and manage your enrollments</p>
      </div>

      {enrollments.length === 0 ? (
       
        <div className="text-center py-5">
          <div className="bg-light rounded p-5">
            <div style={{ fontSize: '4rem' }} className="mb-3">📚</div>
            <h3 className="text-dark mb-3">No Workshops Yet</h3>
            <p className="text-muted mb-4">You haven't enrolled in any workshops yet. Start your learning journey today!</p>
            <button 
              className="btn btn-success btn-lg"
              onClick={() => window.location.href = '/workshops'}
            >
              Browse Workshops
            </button>
          </div>
        </div>
      ) : (
        <>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-center border-0 bg-light">
                <div className="card-body">
                  <h2 className="text-primary fw-bold">{enrollments.length}</h2>
                  <p className="text-muted mb-0">Total Enrolled</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center border-0 bg-light">
                <div className="card-body">
                  <h2 className="text-success fw-bold">{enrollments.filter(e => e.completed).length}</h2>
                  <p className="text-muted mb-0">Completed</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center border-0 bg-light">
                <div className="card-body">
                  <h2 className="text-info fw-bold">{enrollments.filter(e => !e.completed && e.progress > 0).length}</h2>
                  <p className="text-muted mb-0">In Progress</p>
                </div>
              </div>
            </div>
          </div>

        
          <div className="row">
            {enrollments.map((enrollment) => {
              const workshop = getWorkshopData(enrollment);
              const workshopId = workshop._id;
              
              return (
                <div key={enrollment._id || `${workshopId}-${enrollment.enrolledAt}`} className="col-lg-6 col-xl-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    {workshop.image && (
                      <div style={{ height: '200px', overflow: 'hidden' }}>
                        <img 
  src={`http://localhost:5000/uploads/${workshop.image}`} 
  alt={workshop.title}
  className="card-img-top h-100"
  style={{ objectFit: 'cover' }}
  onError={(e) => {
    e.target.style.display = 'none';
  }}
/>

                      </div>
                    )}
                    
                    <div className="card-body d-flex flex-column">
                    
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title text-dark">{workshop.title}</h5>
                        {getStatusBadge(enrollment)}
                      </div>
                      
                      <p className="card-text text-muted flex-grow-1">{workshop.description}</p>
                      
                      
                      <div className="mb-3">
                        {workshop.category && (
                          <span className="badge bg-secondary me-2">{workshop.category}</span>
                        )}
                        {workshop.instructor && (
                          <small className="text-muted">👨‍🏫 {workshop.instructor}</small>
                        )}
                      </div>

                      
                      <div className="mb-3">
                        <small className="text-muted d-block"><strong>Enrolled:</strong> {formatDate(enrollment.enrolledAt)}</small>
                        {workshop.startDate && (
                          <small className="text-muted d-block"><strong>Start Date:</strong> {formatDate(workshop.startDate)}</small>
                        )}
                        {enrollment.completedAt && (
                          <small className="text-success d-block"><strong>Completed:</strong> {formatDate(enrollment.completedAt)}</small>
                        )}
                      </div>

                      
                      {!enrollment.completed && enrollment.progress > 0 && (
                        <div className="mb-3">
                          <div className="progress" style={{ height: '24px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${enrollment.progress}%` }}
                              aria-valuenow={enrollment.progress}
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >
                              {enrollment.progress}%
                            </div>
                          </div>
                        </div>
                      )}

                    
                      <div className="mt-auto">
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleProgressUpdate(workshopId, enrollment.progress || 0)}
                            disabled={actionLoading[`progress-${workshopId}`]}
                          >
                            {actionLoading[`progress-${workshopId}`] ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                              </>
                            ) : (
                              'Update Progress'
                            )}
                          </button>
                          
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleCancelEnrollment(workshopId)}
                            disabled={actionLoading[workshopId]}
                          >
                            {actionLoading[workshopId] ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Cancelling...
                              </>
                            ) : (
                              'Cancel Enrollment'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyWorkshops;