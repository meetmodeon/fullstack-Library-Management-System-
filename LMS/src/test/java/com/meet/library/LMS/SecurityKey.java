package com.meet.library.LMS;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.xml.bind.DatatypeConverter;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;

public class SecurityKey {

//    @Test
//    void generateSecretKey(){
//
//        SecretKey key= Keys.secretKeyFor(SignatureAlgorithm.HS256);
//        String encodedKey= DatatypeConverter.printHexBinary(key.getEncoded());
//        System.out.println("Encoded key:: "+encodedKey);
//    }
}
