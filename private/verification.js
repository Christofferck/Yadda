function verification(req, res) {
    //var s = req.fields.email;
    //var r = /(?!<|>|=|;)(\w+@\w\.)(com|dk|org|net|eu)/;

    var obj = {}


    //console.log(typeof req.fields)

    for (const [key, value] of Object.entries(req.fields)) {

        if (key !== "email" && key !== "accessToken" && key !== "post") {
          console.log(key + ": " + value)

          let s = value
          //let r = new RegExp("/(?!<|>|=|;)/");
          //let r = /(?!<|>|=|;)/;

          let test = s.match(/[^\w\.\-]/)

          //let test = r.test(s);

          console.log(s + ": " + test)
          if(test !== null) {
                console.log("asdasdsd" + key);
               obj.status = false;
               obj.message = `${key}: Verification error - input correct information. `;
               return obj;

          }
          console.log(s.length)
          if(s.length >= 167) {
              obj.status = false;
              obj.message = "Your message is too long. Max 167 Characters";
              return obj
          }
        }

      }

      console.log(req.fields.email)
      if (req.fields.email !== undefined) {
        let s = req.fields.email;
        let r = new RegExp("/(\w+@\w+\.)(com|dk|org|net|eu)/");


        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        test = re.test(String(req.fields.email).toLowerCase());


       // let test = s.test(/(\w+@\w+\.)(com|dk|org|net|eu)/)
       // console.log(s + ": " + test)

        if(test == false) {
          console.log("test failed")
          obj.status = false;
          obj.message = `Email: Verification error - input correct information. `;

          return obj

        } else {
          obj.status = true;
          obj.message = `Your email is true - You will receive a verification email shortly.`;

          return obj

        }
      }
      obj.status = true;


      return obj

}

module.exports = verification;
