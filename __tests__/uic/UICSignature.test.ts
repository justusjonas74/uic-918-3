import { ElementaryTypes } from "../../src/simpleTypes/ElementaryType"
import { UICSignature } from "../../src/uic/UICSignature"
// import rs from 'jsrsasign'

import * as testData from '../testData.json'
const  fullTicket = Buffer.from(testData.fullTicket1, 'hex')


describe("UICSignature class", () => {
    it("has a default name: empty string", ()=>{
        const sig = new UICSignature(Buffer.from("123456"))
        expect(sig).toHaveProperty("name", "")
    })
    
    describe("static fromBuffer()",()=>{
        it("should return a buffer", ()=>{
            const testSignature = UICSignature.fromBuffer(fullTicket)
            expect(testSignature).toHaveProperty("type", ElementaryTypes.UICSignature)
            expect(testSignature).toHaveProperty("buffer")
            expect(testSignature).toHaveProperty("name", "UIC Signature")
            expect(testSignature.buffer.length).toBe(50)
            

        })
    })
    describe("static checkSignature function", () => {
        it("should return true if a valid the signature is valid", async () => {
            const signature = '302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000'
            const ticketDataRaw = '789c65503b4ec34010b51b424395c60585810e643433fbf12e5d888d8c14a56095b4c80113b909911345825b701f3a2ec00138044760c68084c46aa57dfbdedb999d37bbadca510108601480830abd45cc74f46711330498a3665f5116a5182f27a080bc0585cc8aee7e4fca9dd7a80d456803486df0615d77ebae69374c1013480c94801103cfc062c67d7d901af288816640819d6818999bb6d9d47cb12cebe9db6bb75a34ddf26cdc6e9f02104abde9fc7492558b8714cd8576e9f5b844832a933347c52e6e89aa786c964d7ad5d5ab3bf91059e9d3cb4ee41fe1a4b705195066c073de321e33f48fe93f881c48ce17a9a7c869c9693efb0e37bae724e3783878f94cb683f764e78ea2d81d2712b090fb1f7b07c9ee7978f80598b65bdd'

            const key = "MIID0jCCA5CgAwIBAgIJAJsEaC3GG/pfMAsGCWCGSAFlAwQDAjCBoDELMAkGA1UEBhMCREUxDzANBgNVBAgMBkhlc3NlbjESMBAGA1UEBwwJRnJhbmtmdXJ0MRkwFwYDVQQKDBBEQiBWZXJ0cmllYiBHbWJIMRAwDgYDVQQLDAdQLkRWTyAzMRMwEQYDVQQDDApUaG9yZ2UgTG9oMSowKAYJKoZIhvcNAQkBFht0aG9yZ2UubG9oQGRldXRzY2hlYmFobi5jb20wHhcNMTUwOTI5MDczNzU5WhcNMjAwOTI3MDczNzU5WjCBoDELMAkGA1UEBhMCREUxDzANBgNVBAgMBkhlc3NlbjESMBAGA1UEBwwJRnJhbmtmdXJ0MRkwFwYDVQQKDBBEQiBWZXJ0cmllYiBHbWJIMRAwDgYDVQQLDAdQLkRWTyAzMRMwEQYDVQQDDApUaG9yZ2UgTG9oMSowKAYJKoZIhvcNAQkBFht0aG9yZ2UubG9oQGRldXRzY2hlYmFobi5jb20wggG3MIIBKwYHKoZIzjgEATCCAR4CgYEA4/SaAVerKlNF5lhK9ok11psjsTPi6Ckd0eaSXDlyXWBe5xIG78vgAJdnQnM4yt5DyRyHWGc/HwLP2vdZQO5jiI0Rp8uPaI9daYfnHfMEs0EoI7+3O2LRGCAbK0bfsBeEESbMUuBi3U/b/ToVlHx9fzT/gpaX5cZlo7aPo3a8yzsCFQCOqGyL87WfUpN2bungKsMkSA5uTwKBgBXj8BqZKLtEYeGEeguni1jU37aGYVezsZLTzxLxK/4Om45KGLK7L91RjpqZ/ZPF6rQtd+bk5CdKM2gpUvR2W9EeyU1AcqAIWjv084wBVXsvQn9OLyW3wR1OLlsWPzL3B6L7oj9W1rfapMh5ehj6hJT+EeGhF3f/qZsMmEm/nzhVA4GFAAKBgQCcQDwXWQXgRwLiRZV+QpNNnI+Q7RFHOdYxyv2kycxS+YrR9zhigtKxH9AOsF2kvj7qqFDs7V/UGIVyRaUG3fEw/RKMD8gKzT7egqtUwLzw21YEPhuHYHH/lA1NAbTsKMgfELp000P6XwknG/kYDtx+2iGhcWphJf1kFGTJlI6WNaNQME4wHQYDVR0OBBYEFCMQ4jYiKG+c9emmsLr1+p/4abDlMB8GA1UdIwQYMBaAFCMQ4jYiKG+c9emmsLr1+p/4abDlMAwGA1UdEwQFMAMBAf8wCwYJYIZIAWUDBAMCAy8AMCwCFEpzldk5pejQPYL6f4bsNl4CubxxAhQ1cD/osEeBhiam6XE0vm03SOXxRA=="
            

            const isSignatureValid = UICSignature.checkSignature(key, ticketDataRaw, signature)


            return expect(isSignatureValid).toBeTruthy()
        })

        it("should return false if an invalid signature is given", () => {
            const signature = '302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000'
            const ticketDataRaw = '789c65503b4ec34010b51b424395c60585810e643433fbf12e5d888d8c14a56095b4c80113b909911345825b701f3a2ec00138044760c68084c46aa57dfbdedb9991234567837bbadca510108601480830abd45cc74f46711330498a3665f5116a5182f27a080bc0585cc8aee7e4fca9dd7a80d456803486df0615d77ebae69374c1013480c94801103cfc062c67d7d901af288816640819d6818999bb6d9d47cb12cebe9db6bb75a34ddf26cdc6e9f02104abde9fc7492558b8714cd8576e9f5b844832a933347c52e6e89aa786c964d7ad5d5ab3bf91059e9d3cb4ee41fe1a4b705195066c073de321e33f48fe93f881c48ce17a9a7c869c9693efb0e37bae724e3783878f94cb683f764e78ea2d81d2712b090fb1f7b07c9ee7978f80598b65bdd'

            const key = "MIID0jCCA5CgAwIBAgIJAJsEaC3GG/pfMAsGCWCGSAFlAwQDAjCBoDELMAkGA1UEBhMCREUxDzANBgNVBAgMBkhlc3NlbjESMBAGA1UEBwwJRnJhbmtmdXJ0MRkwFwYDVQQKDBBEQiBWZXJ0cmllYiBHbWJIMRAwDgYDVQQLDAdQLkRWTyAzMRMwEQYDVQQDDApUaG9yZ2UgTG9oMSowKAYJKoZIhvcNAQkBFht0aG9yZ2UubG9oQGRldXRzY2hlYmFobi5jb20wHhcNMTUwOTI5MDczNzU5WhcNMjAwOTI3MDczNzU5WjCBoDELMAkGA1UEBhMCREUxDzANBgNVBAgMBkhlc3NlbjESMBAGA1UEBwwJRnJhbmtmdXJ0MRkwFwYDVQQKDBBEQiBWZXJ0cmllYiBHbWJIMRAwDgYDVQQLDAdQLkRWTyAzMRMwEQYDVQQDDApUaG9yZ2UgTG9oMSowKAYJKoZIhvcNAQkBFht0aG9yZ2UubG9oQGRldXRzY2hlYmFobi5jb20wggG3MIIBKwYHKoZIzjgEATCCAR4CgYEA4/SaAVerKlNF5lhK9ok11psjsTPi6Ckd0eaSXDlyXWBe5xIG78vgAJdnQnM4yt5DyRyHWGc/HwLP2vdZQO5jiI0Rp8uPaI9daYfnHfMEs0EoI7+3O2LRGCAbK0bfsBeEESbMUuBi3U/b/ToVlHx9fzT/gpaX5cZlo7aPo3a8yzsCFQCOqGyL87WfUpN2bungKsMkSA5uTwKBgBXj8BqZKLtEYeGEeguni1jU37aGYVezsZLTzxLxK/4Om45KGLK7L91RjpqZ/ZPF6rQtd+bk5CdKM2gpUvR2W9EeyU1AcqAIWjv084wBVXsvQn9OLyW3wR1OLlsWPzL3B6L7oj9W1rfapMh5ehj6hJT+EeGhF3f/qZsMmEm/nzhVA4GFAAKBgQCcQDwXWQXgRwLiRZV+QpNNnI+Q7RFHOdYxyv2kycxS+YrR9zhigtKxH9AOsF2kvj7qqFDs7V/UGIVyRaUG3fEw/RKMD8gKzT7egqtUwLzw21YEPhuHYHH/lA1NAbTsKMgfELp000P6XwknG/kYDtx+2iGhcWphJf1kFGTJlI6WNaNQME4wHQYDVR0OBBYEFCMQ4jYiKG+c9emmsLr1+p/4abDlMB8GA1UdIwQYMBaAFCMQ4jYiKG+c9emmsLr1+p/4abDlMAwGA1UdEwQFMAMBAf8wCwYJYIZIAWUDBAMCAy8AMCwCFEpzldk5pejQPYL6f4bsNl4CubxxAhQ1cD/osEeBhiam6XE0vm03SOXxRA=="
            

            const isSignatureValid = UICSignature.checkSignature(key, ticketDataRaw, signature)


            return expect(isSignatureValid).toBeFalsy()
        })
    })
})