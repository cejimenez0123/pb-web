

function CommentThread({comment}){



    return(

        <div class="comment-thread">
            <div class="comment" id="comment-1">
                <div class="comment-heading">
                    {/* <div class="comment-voting">
                        <button type="button">
                            <span aria-hidden="true">&#9650;</span>
                            <span class="sr-only">Vote up</span>
                        </button>
                        <button type="button">
                            <span aria-hidden="true">&#9660;</span>
                            <span class="sr-only">Vote down</span>
                        </button>
                    </div> */}
                    <div class="comment-info">
                        <a href="#" class="comment-author">someguy14</a>
                        {/* <p class="m-0">
                            22 points &bull; 4 days ago
                        </p> */}
                    </div>
                </div>
        
                <div class="comment-body">
                    <p>
                        This is really great! I fully agree with what you wrote, and this is sure to help me out in the future. Thank you for posting this.
                    </p>
                    <button type="button">Reply</button>
                    <button type="button">Flag</button>
                </div>
        
                <div class="replies">
                    {/* <!-- Comment 2 start --> */}
                    <div class="comment" id="comment-2">
                        <div class="comment-heading">
                            {/* <div class="comment-voting">
                                <button type="button">
                                    <span aria-hidden="true">&#9650;</span>
                                    <span class="sr-only">Vote up</span>
                                </button>
                                <button type="button">
                                    <span aria-hidden="true">&#9660;</span>
                                    <span class="sr-only">Vote down</span>
                                </button>
                            </div> */}
                            <div class="comment-info">
                                <a href="#" class="comment-author">randomperson81</a>
                                {/* <p class="m-0">
                                    4 points &bull; 3 days ago
                                </p> */}
                            </div>
                        </div>
        
                        <div class="comment-body">
                            <p>
                                Took the words right out of my mouth!
                            </p>
                            <button type="button">Reply</button>
                            <button type="button">Flag</button>
                        </div>
                    </div>
                    {/* <!-- Comment 2 end --> */}
        
                    <a href="#load-more">Load more replies</a>
                </div>
            </div>
            {/* <!-- Comment 1 end --> */}
        </div>)
}