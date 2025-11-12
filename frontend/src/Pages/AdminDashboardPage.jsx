import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Image, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBook, FaUsers, FaChartBar } from 'react-icons/fa';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../services/api';

function AdminDashboardPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState(null);
  const [formData, setFormData] = useState({ title:'', description:'', instructor:'', category:'', duration:'', price:'', image:null });
  const [imagePreview, setImagePreview] = useState('');
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({ totalWorkshops:0, totalEnrollments:0, totalCategories:0, topCategory:'' });

  const fetchWorkshops = async () => {
    try {
      const { data } = await getWorkshops();
      setWorkshops(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalWorkshops = workshops.length;
    const totalEnrollments = workshops.reduce((sum, w) => sum + (w.enrolled || 0), 0);
    const categories = [...new Set(workshops.map(w => w.category))];
    const totalCategories = categories.length;
    const categoryCount = {};
    workshops.forEach(w => categoryCount[w.category] = (categoryCount[w.category] || 0) + 1);
    const topCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, '');
    setStats({ totalWorkshops, totalEnrollments, totalCategories, topCategory });
  };

  useEffect(() => { fetchWorkshops(); }, []);
  useEffect(() => { if(workshops.length>0) calculateStats(); }, [workshops]);

  const handleInputChange = e => setFormData({...formData, [e.target.name]: e.target.value});
  const handleImageChange = e => {
    const file = e.target.files[0];
    if(file){
      setFormData({...formData, image:file});
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (index, field, value) => { const updated = [...videos]; updated[index][field] = value; setVideos(updated); };
  const handleVideoFileChange = (index, file) => { const updated = [...videos]; updated[index].file = file; setVideos(updated); };
  const addVideo = () => setVideos([...videos, { file:null, title:'', order: videos.length+1 }]);
  const removeVideo = index => { const updated = [...videos]; updated.splice(index,1); setVideos(updated); };

  const openAddModal = () => { resetForm(); setShowModal(true); };
  const handleEdit = workshop => {
    setCurrentWorkshop(workshop);
    setFormData({...workshop, image:null});
    const existingVideos = (workshop.videos || []).map(v=>({file:null, title:v.title, order:v.order, filename:v.filename}));
    setVideos(existingVideos);
    setImagePreview(`http://localhost:5000/uploads/${workshop.image}`);
    setShowModal(true);
  };
  const resetForm = () => { setFormData({title:'',description:'',instructor:'',category:'',duration:'',price:'',image:null}); setVideos([]); setImagePreview(''); setCurrentWorkshop(null); };

  const handleSubmit = async e => {
    e.preventDefault();
    const workshopData = new FormData();
    Object.keys(formData).forEach(key => { if(formData[key]!==null) workshopData.append(key, formData[key]); });
    videos.forEach((video,index)=>{
      if(video.file) workshopData.append('videos', video.file);
      workshopData.append(`videoTitles[${index}]`, video.title||'');
      workshopData.append(`videoOrders[${index}]`, video.order||index+1);
    });
    try {
      if(currentWorkshop) await updateWorkshop(currentWorkshop._id, workshopData);
      else await createWorkshop(workshopData);
      fetchWorkshops();
      setShowModal(false);
      resetForm();
    } catch (error){ console.error(error); }
  };

  const handleDelete = async id => { if(window.confirm('Are you sure?')) { try{await deleteWorkshop(id); fetchWorkshops();} catch(err){console.error(err);} } };

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col><h1 className="text-primary">Admin Dashboard</h1></Col>
        <Col className="text-end"><Button onClick={openAddModal} className="btn-gradient"><FaPlus /> Add Workshop</Button></Col>
      </Row>

     
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0" style={{background:'linear-gradient(135deg,#6C63FF,#C792FF)',color:'#fff'}}>
            <Card.Body><FaBook size={28} /><h3>{stats.totalWorkshops}</h3><p>Total Workshops</p></Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0" style={{background:'linear-gradient(135deg,#FF6584,#FFB199)',color:'#fff'}}>
            <Card.Body><FaUsers size={28} /><h3>{stats.totalEnrollments}</h3><p>Total Enrollments</p></Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0" style={{background:'linear-gradient(135deg,#3AD29F,#43E97B)',color:'#fff'}}>
            <Card.Body><FaChartBar size={28} /><h3>{stats.totalCategories}</h3><p>Categories</p></Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0" style={{background:'linear-gradient(135deg,#FFB75E,#ED8F03)',color:'#fff'}}>
            <Card.Body><FaChartBar size={28} /><h3>{stats.topCategory || 'N/A'}</h3><p>Top Category</p></Card.Body>
          </Card>
        </Col>
      </Row>

     
      {loading ? <p>Loading...</p> :
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark"><tr><th>Image</th><th>Title</th><th>Instructor</th><th>Category</th><th>Price</th><th>Enrolled</th><th>Actions</th></tr></thead>
          <tbody>
            {workshops.map(w => (
              <tr key={w._id} className="align-middle">
                <td><Image src={`http://localhost:5000/uploads/${w.image}`} width="50" height="50" rounded /></td>
                <td>{w.title}</td>
                <td>{w.instructor}</td>
                <td><Badge bg="info">{w.category}</Badge></td>
                <td>${w.price}</td>
                <td><Badge bg="success">{w.enrolled || 0}</Badge></td>
                <td>
                  <Button size="sm" className="me-1" variant="warning" onClick={() => handleEdit(w)}><FaEdit /></Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(w._id)}><FaTrash /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }

      
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{borderBottom:'1px solid #eee'}}>
          <Modal.Title>{currentWorkshop ? 'Edit Workshop' : 'Add Workshop'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}><Form.Group><Form.Label>Title</Form.Label><Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Instructor</Form.Label><Form.Control type="text" name="instructor" value={formData.instructor} onChange={handleInputChange} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} required /></Form.Group>
            <Row className="mb-3">
              <Col md={4}><Form.Group><Form.Label>Category</Form.Label><Form.Control type="text" name="category" value={formData.category} onChange={handleInputChange} required /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Duration</Form.Label><Form.Control type="text" name="duration" value={formData.duration} onChange={handleInputChange} required /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Price</Form.Label><Form.Control type="text" name="price" value={formData.price} onChange={handleInputChange} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Image</Form.Label><Form.Control type="file" onChange={handleImageChange} accept="image/*" /></Form.Group>
            {imagePreview && <Image src={imagePreview} width="120" height="120" rounded className="mb-3" />}

            <h5>Videos</h5>
            {videos.map((video,i)=>(
              <Row key={i} className="mb-2 align-items-center">
                <Col><Form.Control placeholder="Title" value={video.title} onChange={e=>handleVideoChange(i,'title',e.target.value)} /></Col>
                <Col><Form.Control type="file" onChange={e=>handleVideoFileChange(i,e.target.files[0])} /></Col>
                <Col><Form.Control placeholder="Order" value={video.order} onChange={e=>handleVideoChange(i,'order',e.target.value)} /></Col>
                <Col><Button variant="danger" onClick={()=>removeVideo(i)}>Remove</Button></Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={addVideo} className="mb-3">Add Video</Button>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={()=>setShowModal(false)}><FaTimes /> Cancel</Button>
              <Button type="submit" variant="primary"><FaSave /> Save</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminDashboardPage;
