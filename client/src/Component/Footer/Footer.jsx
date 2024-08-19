import './Footer.css'

function Footer() {
  return (
    <div className='footer'>
        <div className="newsletter">
            <h2>Join Our Newsletter</h2>
            <p>Receive latest update on our new product</p>
            <form className="input">
                <input type='email' placeholder='your email address' />
                <button className='btn'>Join</button>
            </form>
        </div>

            <div className="center">
                <div className="left">theLimits Asoke</div>
                
                <div className="middle">
                    <h2 className="title">Connect with us</h2>
                    <div className="medias"></div>
                </div>

                <div className="right">
                    <h2 className="title">Address</h2>
                </div>
            </div>


        <div className="footnote">Built and Maintained </div>
    </div>
  )
}

export default Footer