
//Components

import { Route, Routes } from "react-router-dom";
import MainContent from "../components/MainContent";

//Por ahora 

export default function AppRouter() {
    return (
        <Routes>
            <Route path='/' element={<MainContent />} />
            <Route path='/gestiones' element={<MainContent table='gestiones' />} />
            <Route path='/usuarios' element={<MainContent table='usuarios'/>} />
            <Route path='/equipos' element={<MainContent table='equipos'/>} />
        </Routes>
    )
}
