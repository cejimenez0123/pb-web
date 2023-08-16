const BookBanner = ({ books, speed = 40000 }) => {

    return (
    <div className="book-banner">
      <div className="inner">
        <div className="wrapper">
          <section style={{ "--speed": `${speed}ms` }}>
            {books.map(book =>{
                return (<BookBannerItem book={book}/>)
            })}
            {/* {images.map(({ id, image }) => (
              <div className="image" key={id}>
                <img src={image} alt={id} />
              </div>
            ))} */}
          </section>
          <section style={{ "--speed": `${speed}ms` }}>
            {books.map(book =>{
                return (<BookBannerItem book={book}/>)
            })}
            {/* {images.map(({ id, image }) => (
              <div className="image" key={id}>
                <img src={image} alt={id} />
              </div>
            ))} */}
          </section>
          <section style={{ "--speed": `${speed}ms` }}>
            {books.map(book =>{
                return (<BookBannerItem book={book}/>)
            })}
            {/* {images.map(({ id, image }) => (
              <div className="image" key={id}>
                <img src={image} alt={id} />
              </div>
            ))} */}
          </section>
          {/* <section style={{ "--speed": `${speed}ms` }}>
            {images.map(({ id, image }) => (
              <div className="image" key={id}>
                <img src={image} alt={id} />
              </div>
            ))}
          </section>
          <section style={{ "--speed": `${speed}ms` }}>
            {images.map(({ id, image }) => (
              <div className="image" key={id}>
                <img src={image} alt={id} />
              </div>
            ))}
          </section> */}
        </div>
      </div>
      </div>
    );
  };

  function BookBannerItem({book}){

    return(<div className="book-banner-item">
            <h6> {book.title}</h6>

    </div>)
  }
  
export default BookBanner