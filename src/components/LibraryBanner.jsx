const LibraryBanner = ({ libraries, speed = 40000 }) => {

    return (
    <div className="library-banner">
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

  function LibraryBannerItem({lib}){

    return(<div className="book-banner-item">
            <h6> {book.title}</h6>

    </div>)
  }