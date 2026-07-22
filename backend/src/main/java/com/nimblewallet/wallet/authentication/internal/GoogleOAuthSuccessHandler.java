package com.nimblewallet.wallet.authentication.internal;

import java.io.IOException;

import com.nimblewallet.wallet.authentication.AuthenticationService;
import com.nimblewallet.wallet.shared.config.WalletProperties;
import com.nimblewallet.wallet.user.AppUser;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * After Google authenticates the user, resolves/links our own account, issues
 * the session cookie, and redirects to the frontend — replacing the old
 * {@code /auth/google/callback} controller.
 */
@Component
public class GoogleOAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthenticationService authentication;
    private final JwtService jwtService;
    private final AuthCookieFactory cookieFactory;
    private final String postLoginRedirect;

    public GoogleOAuthSuccessHandler(AuthenticationService authentication, JwtService jwtService,
                                     AuthCookieFactory cookieFactory, WalletProperties properties) {
        this.authentication = authentication;
        this.jwtService = jwtService;
        this.cookieFactory = cookieFactory;
        this.postLoginRedirect = properties.auth().postLoginRedirect();
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authenticationToken) throws IOException, ServletException {
        OAuth2User principal = (OAuth2User) authenticationToken.getPrincipal();
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String googleId = principal.getAttribute("sub");

        AppUser user = authentication.findOrCreateGoogleUser(email, name, googleId);
        String token = jwtService.issue(user.getId(), user.getEmail(), user.getPhoneNumber());
        response.addHeader(HttpHeaders.SET_COOKIE, cookieFactory.issue(token).toString());

        getRedirectStrategy().sendRedirect(request, response, postLoginRedirect);
    }
}
