
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
    // Ejemplos de otro proyecto para tener a mano:
    //     <Routes>
    //         <Route path='/' element={<ItemListContainer greeting={'Listado productos'} />} />
    //         <Route path='/category/:categoryId' element={<ItemListContainer />} />
    //         <Route path='/detail/:productId' element={ <ItemDetailContainer /> } />
    //         <Route path='/cart' element={<CartContainer />} />
    //         <Route path='/checkout' element={ <CheckOut />} />
    //     </Routes>
    // )
