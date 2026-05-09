
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Actions } from './pages/Actions'
import { Campaigns } from './pages/Campaigns'
import { Creatures } from './pages/Creatures'
import { CampaignForm } from './pages/CampaignForm'

function App() {

  return (
    <>
  <Layout>
   <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/actions" element={<Actions />} />
    <Route path="/campaigns/new" element={<CampaignForm />} />
    <Route path="/campaigns/:id/edit" element={<CampaignForm />} />
    <Route path="/campaigns" element={<Campaigns />} />
    <Route path="/creatures" element={<Creatures />} />
   </Routes>
  </Layout>
    </>
  )
}

export default App
