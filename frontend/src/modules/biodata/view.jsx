import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BiodataView() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '', position: '', ktp: '', pob: '', dob: '',
    gender: '', religion: '', blood_type: '', marital_status: '',
    address_ktp: '', address: '', email: '', phone_number: '',
    closest_person: '', skills: '', willing_to_be_placed: '', expected_salary: ''
    ,
    education: [],
    courses: [],
    employment: []
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const endpoint = id ? `/v1/biodatas/${id}` : '/v1/biodatas/me';
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        // Populate formData so the form is pre-filled when editing
        if (data.biodata) {
          setFormData({
            ...data.biodata,
            dob: data.biodata.dob ? data.biodata.dob.split('T')[0] : '', // Format date for <input type="date">
            education: data.education || [],
            courses: data.courses || [],
            employment: data.employment || []
          });
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { last_education: '', institution: '', major: '', graduation_year: '', ipk: '' }]
    });
  };

  const addCourse = () => {
    setFormData({
      ...formData,
      courses: [...formData.courses, { course_name: '', is_sertificated: '', year: '' }]
    });
  };

  const addEmployment = () => {
    setFormData({
      ...formData,
      employment: [...formData.employment, { company_name: '', last_position: '', last_salary: '', year: '' }]
    });
  };

  const handleArrayChange = (type, index, field, value) => {
    const updatedArray = [...formData[type]];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = JSON.parse(atob(token.split('.')[1])).email;
      const isUpdate = !!formData.id;
      const endpoint = isUpdate ? `/v1/biodatas/${formData.id}` : '/v1/biodatas';
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          biodata: { ...formData, email: userEmail },
          education: formData.education,
          courses: formData.courses,
          employment: formData.employment
        }),
      });

      if (response.ok) {
        alert(isUpdate ? "Profile updated!" : "Biodata created!");
        fetchProfile();
      }
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Employee Biodata</h1>

      {profile ? (
        <div>
          {id ? <p></p> : <h3>Welcome, {profile.biodata.name}</h3>}
          <p><strong>POSISI YANG DILAMAR:</strong> {profile.biodata.position}</p>
          <p><strong>NAMA:</strong> {profile.biodata.name}</p>
          <p><strong>NO. KTP:</strong> {profile.biodata.ktp}</p>
          <p><strong>TEMPAT, TANGGAL LAHIR:</strong> {profile.biodata.pob}, {profile.biodata.dob}</p>
          <p><strong>JENIS KELAMIN:</strong> {profile.biodata.gender}</p>
          <p><strong>AGAMA:</strong> {profile.biodata.religion}</p>
          <p><strong>GOLONGAN DARAH:</strong> {profile.biodata.blood_type}</p>
          <p><strong>STATUS:</strong> {profile.biodata.marital_status}</p>
          <p><strong>ALAMAT KTP:</strong> {profile.biodata.address_ktp}</p>
          <p><strong>ALAMAT TINGGAL:</strong> {profile.biodata.address}</p>
          <p><strong>EMAIL:</strong> {profile.biodata.email}</p>
          <p><strong>NO. TELP:</strong> {profile.biodata.phone_number}</p>
          <p><strong>ORANG TERDEKAT YANG DAPAT DIHUBUNGI:</strong> {profile.biodata.closest_person}</p>

          <h4>PENDIDIKAN TERAKHIR</h4>
          {profile.education?.map((edu, i) => (
            <p key={i}>{edu.last_education} - {edu.institution} ({edu.graduation_year})</p>
          ))}
          <h4>RIWAYAT PELATIHAN</h4>
          {profile.courses?.map((c, i) => (
            <p key={i}>{c.course_name} - {c.year} (Sertifikat: {c.is_sertificated})</p>
          ))}
          <h4>RIWAYAT PEKERJAAN</h4>
          {profile.employment?.map((emp, i) => (
            <p key={i}>{emp.company_name} as {emp.last_position} ({emp.year})</p>
          ))}
          <p><strong>SKILLS:</strong> {profile.biodata.skills}</p>
          <p><strong>BERSEDIA DITEMPATKAN DI SELURUH KANTOR PERUSAHAAN:</strong> {profile.biodata.willing_to_be_placed}</p>
          <p><strong>PENGHASILAN YANG DIHARAPKAN:</strong> {profile.biodata.expected_salary}</p>
          {!id && <button onClick={() => setProfile(null)}>Edit</button>}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>{formData.id ? 'Edit Biodata' : 'Create New Biodata'}</h3>
          <div>
            <label>POSISI YANG DILAMAR: </label>
            <input
              type="text"
              value={formData.position || ''}
              onChange={e => setFormData({ ...formData, position: e.target.value })}
            />
          </div>

          <div>
            <label>NAMA: </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label>NO. KTP: </label>
            <input
              type="text"
              value={formData.ktp || ''}
              onChange={e => setFormData({ ...formData, ktp: e.target.value })}
            />
          </div>

          <div>
            <label>TEMPAT LAHIR: </label>
            <input
              type="text"
              value={formData.pob || ''}
              onChange={e => setFormData({ ...formData, pob: e.target.value })}
            />
          </div>

          <div>
            <label>TANGGAL LAHIR: </label>
            <input
              type="date"
              value={formData.dob || ''}
              onChange={e => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>

          <div>
            <label>JENIS KELAMIN: </label>
            <input
              type="text"
              value={formData.gender || ''}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
            />
          </div>

          <div>
            <label>AGAMA: </label>
            <input
              type="text"
              value={formData.religion || ''}
              onChange={e => setFormData({ ...formData, religion: e.target.value })}
            />
          </div>

          <div>
            <label>GOLONGAN DARAH: </label>
            <input
              type="text"
              value={formData.blood_type || ''}
              onChange={e => setFormData({ ...formData, blood_type: e.target.value })}
            />
          </div>

          <div>
            <label>STATUS: </label>
            <input
              type="text"
              value={formData.marital_status || ''}
              onChange={e => setFormData({ ...formData, marital_status: e.target.value })}
            />
          </div>

          <div>
            <label>ALAMAT KTP: </label>
            <input
              type="text"
              value={formData.address_ktp || ''}
              onChange={e => setFormData({ ...formData, address_ktp: e.target.value })}
            />
          </div>

          <div>
            <label>ALAMAT TINGGAL: </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label>EMAIL: </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label>NO. TELP: </label>
            <input
              type="text"
              value={formData.phone_number || ''}
              onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
            />
          </div>

          <div>
            <label>ORANG TERDEKAT YANG DAPAT DIHUBUNGI: </label>
            <input
              type="text"
              value={formData.closest_person || ''}
              onChange={e => setFormData({ ...formData, closest_person: e.target.value })}
            />
          </div>

          <div>
            <label>SKILLS: </label>
            <input
              type="text"
              value={formData.skills || ''}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>
          <div>
            <label>BERSEDIA DITEMPATKAN DI SELURUH KANTOR PERUSAHAAN: </label>
            <input
              type="text"
              value={formData.willing_to_be_placed || ''}
              onChange={e => setFormData({ ...formData, willing_to_be_placed: e.target.value })}
            />
          </div>
          <div>
            <label>PENGHASILAN YANG DIHARAPKAN: </label>
            <input
              type="text"
              value={formData.expected_salary || ''}
              onChange={e => setFormData({ ...formData, expected_salary: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}>
            <h4>PENDIDIKAN TERAKHIR <button type="button" onClick={addEducation}>TAMBAH</button></h4>
            {formData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
                <input placeholder="Jenjang" value={edu.last_education} onChange={e => handleArrayChange('education', index, 'last_education', e.target.value)} />
                <input placeholder="Institusi" value={edu.institution} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} />
                <input placeholder="Jurusan" value={edu.major} onChange={e => handleArrayChange('education', index, 'major', e.target.value)} />
                <input placeholder="Tahun Lulus" value={edu.graduation_year} onChange={e => handleArrayChange('education', index, 'graduation_year', e.target.value)} />
                <input placeholder="IPK" value={edu.ipk} onChange={e => handleArrayChange('education', index, 'ipk', e.target.value)} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}>
            <h4>RIWAYAT PELATIHAN <button type="button" onClick={addCourse}>TAMBAH</button></h4>
            {formData.courses.map((course, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
                <input placeholder="Nama Kursus" value={course.course_name} onChange={e => handleArrayChange('courses', index, 'course_name', e.target.value)} />
                <input placeholder="Sertifikat (Ya/Tidak)" value={course.is_sertificated} onChange={e => handleArrayChange('courses', index, 'is_sertificated', e.target.value)} />
                <input placeholder="Tahun" value={course.year} onChange={e => handleArrayChange('courses', index, 'year', e.target.value)} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}>
            <h4>RIWAYAT PEKERJAAN <button type="button" onClick={addEmployment}>TAMBAH</button></h4>
            {formData.employment.map((emp, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
                <input placeholder="Perusahaan" value={emp.company_name} onChange={e => handleArrayChange('employment', index, 'company_name', e.target.value)} />
                <input placeholder="Posisi Terakhir" value={emp.last_position} onChange={e => handleArrayChange('employment', index, 'last_position', e.target.value)} />
                <input placeholder="Gaji Terakhir" value={emp.last_salary} onChange={e => handleArrayChange('employment', index, 'last_salary', e.target.value)} />
                <input placeholder="Tahun" value={emp.year} onChange={e => handleArrayChange('employment', index, 'year', e.target.value)} />
              </div>
            ))}
          </div>

          <button type="submit">Save Profile</button>
        </form>
      )}
    </div>
  );
}