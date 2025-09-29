import {useState, useEffect} from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import projectAPI from '../../api/Api';
import './ViewLanguagePage.css'

import ViewLanguageTable from '../../components/ViewLanguageTable/ViewLanguageTable';

function ViewLanguagePage() {
    const [language, setLanguage] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      await projectAPI.getLangauge().then((response)=>{
        const formattedLanguages = response.data.map((lang)=>({
          lId: lang.id,
          lName:lang.name,
          lStatus: lang.status,
          lInactiveReason: lang.inactive_reason
        }))
        setLanguage(formattedLanguages);
      })
    } catch(err){
      console.error("Error fetching languages:", err);
    }
  }

  const handleBack = () =>{
    navigate('/');
  }
  return (
    <div className='p-4'>
      <ViewLanguageTable rows={language}/>
      <Button variant='danger' onClick={()=>handleBack()}>Back</Button>
    </div>
  )
}

export default ViewLanguagePage
