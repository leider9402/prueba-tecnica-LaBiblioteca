
import axios from 'axios';
const doSearchUrl = doGetCurrentURL() + "/search";


export async function doSearch(book) {
    try {
        const data = await axios.get(doSearchUrl+'/'+book, {  
            withCredentials: false,
            crossdomain: true                    
                                            
        }) 
        console.log(data);
        return data.data.books;
    }catch (error) {
        console.error(error);
    }
}

export function doGetCurrentURL() {
    return 'https://api.itbook.store/1.0';
}