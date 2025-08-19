import { useNavigate } from "react-router-dom";
const BookBanner = ({ books, speed = 40000 }) => {

    return (
    <div className="book-banner">
      <div className="inner">
        <div className="wrapper">
          <section style={{ "--speed": `${speed}ms` }}>
            {books.map(book =>{
                return (<BookBannerItem book={book}/>)
            })}
         
          </section>
          <section style={{ "--speed": `${speed}ms` }}>
            {books.map(book =>{
                return (<BookBannerItem book={book}/>)
            })}
           
          </section>
          <section style={{ "--speed": `${speed}ms` }}>
            {books.map(book =>{
                return (<BookBannerItem book={book}/>)
            })}
          
          </section>
          
        </div>
      </div>
      </div>
    );
  };

  function BookBannerItem({book}){
    const navigate = useNavigate()
    const handleOnClick = ()=>{
        const params = {
            book: book
        }
        navigate(`/book/${book.id}`)
        
    }
    return(<div onClick={handleOnClick} className="book-banner-item">
            <h6 className="lora-medium"> {book.title}</h6>

    </div>)
  }
  
export default BookBanner