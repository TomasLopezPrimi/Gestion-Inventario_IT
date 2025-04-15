
//Components

import { Route, Routes } from "react-router-dom";
import MainContent from "../components/MainContent";



export default function AppRouter() {
    return (
        <Routes>
            <Route path='/' element={<MainContent />} />
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
