from paramiko import client, AutoAddPolicy
import os
command = "cd html;git pull"
host = os.environ['host']
password = os.environ['pw']
username = os.environ['id']
client = client.SSHClient()
client.set_missing_host_key_policy(AutoAddPolicy())
client.connect(host, username=username, password=password)
_stdin, _stdout,_stderr = client.exec_command(command)
print(_stdout.read().decode())
client.close()
