package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.repository.UserRepo;
import com.meet.library.LMS.service.OtpService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@AllArgsConstructor
public class OtpServiceImpl implements OtpService {
    private Map<String,OtpData> otpMap=new ConcurrentHashMap<>();
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final UserRepo userRepo;

    @Async("taskExecutor")
    @Override
    public void sendOtp(String email) {
        String otp=String.format("%06d",new Random().nextInt(999999));
        LocalDateTime expiry=LocalDateTime.now().plusMinutes(2);

        otpMap.put(email,new OtpData(otp,expiry));
        sendEmail(email,otp);
    }

    private void sendEmail(String to,String otp){
        try {
            MimeMessage msg=mailSender.createMimeMessage();
            MimeMessageHelper helper=new MimeMessageHelper(msg,true);


            helper.setTo(to);
            helper.setSubject("Your OTP Code");

            Context context=new Context();
            context.setVariable("otp",otp);
            context.setVariable("email",to);

            String htmlContext=templateEngine.process("send-otp",context);

            helper.setText(htmlContext,true);;
            mailSender.send(msg);

        }catch (MessagingException m){
            throw new RuntimeException("Error is mail sending: "+m.getMessage());
        }
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        if(!otpMap.containsKey(email)) return false;

        OtpData otpData=otpMap.get(email);
        if(otpData.getExpiry().isBefore(LocalDateTime.now())){
            otpMap.remove(email);
            return false;
        }
        if(!otpData.getOtp().equals(otp)) return false;

        otpMap.remove(email);
        return true;
    }

    @Override
    public boolean canResendOtp(String email) {
        return !otpMap.containsKey(email) || otpMap.get(email).getExpiry().isBefore(LocalDateTime.now());
    }

    @Override
    public Optional<User> findByEmail(String email){
        return userRepo.findByEmail(email);
    }
    @Data
    @AllArgsConstructor
    private static class OtpData{
        private String otp;
        private LocalDateTime expiry;
    }
}
