
export default function getTimePast(created){
    const then = new Date(created); // Replace with your past time
    const now = new Date();
    
    const diffMs = now - then; // Difference in milliseconds
    const diffSec = Math.floor(diffMs / 1000); // Convert to seconds
    const diffMin = Math.floor(diffSec / 60); // Convert to minutes
    const diffHours = Math.floor(diffMin / 60); // Convert to hours
    const diffDays = Math.floor(diffHours / 24); // Convert to days

    
    let time = `${diffMin} mins ago`
   if(diffHours>24) {
        time = `${diffDays} days ago`
    }else if(diffMin>59){
        time = `${diffHours} hours ago`
      
    }else{
        time = `${diffMin} mins ago`
    }
    return time
            
}