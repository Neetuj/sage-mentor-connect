-- Configure auth settings for better security
UPDATE auth.config SET 
  otp_exp = 600, -- 10 minutes instead of default
  enable_password_policy = true;