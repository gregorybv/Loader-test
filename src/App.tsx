import './App.css'
import {QueryClient, QueryClientProvider} from "react-query";
import {Loader} from "./components/Loader/Loader.tsx";

function App() {

    const queryClient = new QueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Loader/>
            </QueryClientProvider>
        </>
    )
}

export default App
