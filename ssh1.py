from paramiko import client, AutoAddPolicy
import os
command = "cd html;git pull;ls"
host = os.environ['HOST']
password = os.environ['PW']
username = os.environ['ID']
client = client.SSHClient()
client.set_missing_host_key_policy(AutoAddPolicy())
client.connect(host, username, password=password)
_stdin, _stdout,_stderr = client.exec_command(command)
print(_stdout.read().decode())
client.close()
