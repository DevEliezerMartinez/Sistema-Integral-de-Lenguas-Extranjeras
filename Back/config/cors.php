<?php

return [
    'paths' => ['api/*', 'sanctum/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://194.238.25.213:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'hosts' => [],
    'allow_credentials' => false,
    'allow_origin_regex' => false,
    'allow_origin_regex_patterns' => [],
    'allow_headers_regex' => false,
    'allow_headers_regex_patterns' => [],
    'allow_methods_regex' => false,
    'allow_methods_regex_patterns' => [],
];