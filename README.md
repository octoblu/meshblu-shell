# meshblu-shell

Gateblu connector to execute shell commands. Uses  [spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

#### Options Schema
```json
{
  "shellCommand": [
    "touch"
  ]
}
```

#### Message Schema
```json
{
  "options": [
    "arg1",
    "arg2"
  ]
}
```

#### Error Response
```json
{
  "devices": ["*"],
  "topic": "stderr",
  "payload": {
    "stderr": "touch: ~/foo.txt: No such file or directory"
  }
}
```

#### Output Response
```json
{
  "devices": ["*"],
  "topic": "stdout",
  "payload": {
    "stdout": "hi"
  }
}
```

#### Exit Code Response
```json
{
  "devices": ["*"],
  "topic": "exit",
  "payload": {
    "code": 1
  }
}
```
