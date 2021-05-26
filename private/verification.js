function verification(req, res) {
  //var s = req.fields.email;
  //var r = /(?!<|>|=|;)(\w+@\w\.)(com|dk|org|net|eu)/;

  var obj = {}




  for (const [key, value] of Object.entries(req.fields)) {

    if (key !== "email" && key !== "accessToken" && key !== "post") {
      let test = value.match(/[^a-zA-Z0-9æøå#!,.-_ ]/)


      if (test !== null) {
        obj.status = false;
        obj.message = `${key}: Verification error - input correct information. `;
        return obj;

      }
      if (value.length >= 167) {
        obj.status = false;
        obj.message = "Your message is too long. Max 167 Characters";
        return obj
      }
    }

  }


  if (req.fields.email !== undefined) {
    let s = req.fields.email;
    let r = new RegExp("/(\w+@\w+\.)(com|dk|org|net|eu)/");


    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    test = re.test(String(req.fields.email).toLowerCase());


    if (test == false) {
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
