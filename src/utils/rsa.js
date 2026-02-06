import JSEncrypt from 'jsencrypt'
import Encrypt from 'encryptlong'

/**
 * 此管理后台登录密码加密公钥
 */
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC80L0LpNqSjVnNq1mLtdEcH/Nfc6AKSqGcrahNeP3QIYnPS613bx/yTFTYkbol+lBd2H1r2DJFAm5KRO7UcqPpcw1hE98Xc3DSipnuRlCHggm8BzuOAqvQVzuX2Gf08ARYK2U5ColaDliDLdB6RuA11fATXJaIYAqLskIm5+92JQIDAQAB'

/**
 * UP主管理后台登录密码加密公钥
 */
const publicKey2 = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAItLJ4O8QANqRQ6uNAYalA+YiqFA/+STQwwW3o6tKkWEk/kSHxI1NNpsYY3prqB2VzcmGaZKe83XAy6YwHL6G3PlRwUbxpXJ3uTSBAUDe1henMcSK1MSP/iGLh6/XnWxUMIiWXao9T2pesNgj4ciNv5J4W/Z/9zQKNU5ZCJTTN2bAgMBAAECgYArJeumnhDCPhAIPSQ2Y9NLhXgj/WuHFarmOstULQX0JN5lgByJ2lt18a7CdAm5AQ+BMNcvMNFq8Ni2fXDX7OvFowKJdzWbcEqo4n4qrSNQfRtozLWCQV4cVeSqCJtIiD9Gk8njTJ8tzqLHD/0nXxEwHfKbNdWPdmUagSMveQvyiQJBAOFtFhFUxPNLYJkQAPlVbPkmxkfGSYCeKB02oZdBXdROW/rbGdZwCh+NCKQhsKLewKe4CxhU5FqDXdqxL3hGoz0CQQCeL4Asyz0/3swZSc0K6t7ee4PSZfVX+TtbctfLpsuG6MPCVB4EXMrztVchgoObkmjL564ELVGQXDo4Tgi0xbG3AkAScYxmqpralQY4P7j0rWqXD/cVFEIbRdVeXoPmDjERF8AqzBZXFx+c6TsVwrPi/3qfvk0aFogAZ9Mb+3c4zf65AkBuafeMzLxPBcPu7t2pfjHcl9h2luZ+5p+xAGNyalVsMLLbxP1CzEZ5gB12bXRRtgtiMK/9iGiDXGzi+k0HaWrXAkEAkvWX+RvgoSrTLo/FxhsuUWFS3Deyt5KAp+nUcU2UL4Ck/UYHHJI6PeeY2VCmTAm7zO3UBMthODDKjltc92ViNA=='

export function resPublicData(data) {
  var jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(publicKey)
  var result = jsencrypt.encrypt(data)
  return result
}

export function encrypt(data) {
  const PUBLIC_KEY = publicKey
  var enceyptor = new Encrypt()
  enceyptor.setPublicKey(PUBLIC_KEY)
  var result = enceyptor.encryptLong(data)
  return result
}

export function encrypt2(data) {
  const PUBLIC_KEY = publicKey2
  var enceyptor = new Encrypt()
  enceyptor.setPublicKey(PUBLIC_KEY)
  var result = enceyptor.encryptLong(data)
  return result
}
