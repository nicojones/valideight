<?php

/**
 * @author Nico Kupfer
 * @email nico.kupfer&#83;mamasulabs.com
 */
class Valideight {
    
    private static $instance = FALSE;
    
    public $url = "/^[a-zA-Z0-9\-_\?!\* @#\.,\+]+$/";
    public $email = "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5})$/";
    public $pass = "/^[a-zA-Z0-9\-_\?!\*@#\.\+]+$/";
    public $usDate = "/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/";
    public $euDate = "/^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/";
    
    public function __construct() { /* * * */ }
    
    public static function singleton() {
        if (!self::$instance) {
            $c = __CLASS__;
            self::$instance = new $c;
        }

        return self::$instance;
    }
    
   /**
    * Valideights a text input field. Returns true if the text is valid or, in case it is not required, if it is empty.
    * @param string $text
    * @param bool $required = FALSE
    * @param string $customRegex = FALSE
    * @param int $minLength = 0 The minimum length of the text
    * @return bool Valid or not.
    */
    public function valideightText($text = '', $required = FALSE, $customRegex = FALSE, $minLength = 0) {
        if ($required && !strlen($text)) return FALSE;
        if (!$required && !strlen($text)) return TRUE;
        
        $regex = $customRegex ?: FALSE;
        if ($regex) {
            preg_match($regex, $text, $matches);
            if (!count($matches)) return FALSE;
        }
        
        return (bool)(strlen($text) >= $minLength);
    }
    
   /**
    * Valideights a URL input field. Returns true if the URL is valid or, in case it is not required, if $URL is empty.
    * @param string $URL
    * @param bool $required = FALSE
    * @param string $customRegex = FALSE
    * @return bool Valid or not.
    */
    public function valideightURL($URL = '', $required = FALSE, $customRegex = FALSE) {
        if ($required && !strlen($URL)) return FALSE;
        if (!$required && !strlen($URL)) return TRUE;

        $regex = $customRegex ?: $this->url;
        preg_match($regex, $URL, $matches);
        
        return (bool)count($matches);
    }
    
   /**
    * Valideights an email input field. Returns true if the email is valid or, in case it is not required, if email is empty.
    * @param string $email
    * @param bool $required = FALSE
    * @param string $customRegex = FALSE
    * @return bool Valid or not.
    */
    public function valideightEmail($email = '', $required = FALSE, $customRegex = FALSE) {
        if ($required && !strlen($email)) return FALSE;
        if (!$required && !strlen($email)) return TRUE;
        
        $regex = $customRegex ?: $this->email;
        preg_match($regex, $email, $matches);
        return (bool)count($matches);
    }
    
   /**
    * Valideights an date input field. Returns true if the date is valid or, in case it is not required, if the date is empty.
    * @param string $date
    * @param bool $required = FALSE
    * @param string $format = US The date format (YYYY-MM-DD or DD-MM-YYYY)
    * @param string $customRegex = FALSE
    * @return bool Valid or not.
    */
    public function valideightDate($date = '', $required = FALSE, $format = 'US', $customRegex = FALSE) {
        if ($required && !strlen($date)) return FALSE;
        if (!$required && !strlen($date)) return TRUE;
        
        if ($customRegex) {
            $regex = $customRegex;
        } elseif ($format === 'US') {
            $regex = $this->usDate;
        } elseif ($format === 'EU') {
            $regex = $this->euDate;
        } else {
            return FALSE;
        }
        
        preg_match($regex, $date, $matches);
        return (bool)count($matches);
    }
    
   /**
    * Valideights a password input field. Returns true if the password is valid or, in case it is not required, if the date is empty.
    * @param string $pass
    * @param bool $required = FALSE
    * @param string $useRegex = FALSE If set to true, the default password regex will be used or, if provided, the given $customRegex will be used
    * @param string $customRegex = FALSE
    * @return bool Valid or not.
    */
    public function valideightPass($pass = '', $required = FALSE, $useRegex = FALSE, $customRegex = FALSE, $minLength = 0) {
        if ($required && !strlen($pass)) return FALSE;
        if (!$required && !strlen($pass)) return TRUE;
        
        if ($useRegex) {
            $regex = $customRegex ?: $this->pass;
            
            preg_match($regex, $pass, $matches);
            if (!count($matches)) return FALSE;
        }
        return (bool)(strlen($pass) > $minLength);
    }
    
   /**
    * Valideights a number input field. Returns true if the number is valid or, in case it is not required, if the number is empty.
    * @param string $number
    * @param bool $required = FALSE
    * @param string $minVal = FALSE If desired, a minimum value
    * @param string $maxVal = FALSE If desired, a maximum value
    * @return bool Valid or not.
    */
    public function valideightNumber($number = FALSE, $required = FALSE, $minVal = FALSE, $maxVal = FALSE) {
        if (!$required && $number == '') return TRUE;
        if (($required && !$number) || (is_nan($number)) || ($minVal && $number < (int)$minVal) || ($maxVal && $number > (int)$maxVal)) {
            return FALSE;
        } else {
            return TRUE;
        }
    }
}