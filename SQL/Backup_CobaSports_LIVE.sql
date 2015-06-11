declare @databaseName as varchar(100)

set @databaseName = 'D:\Backup\Coba Sports\CobaSports_LIVE_' + REPLACE(CONVERT(varchar(20), GetDate(),120),':','_') + '.bak'

BACKUP DATABASE CobaSport_LIVE
 TO DISK = @databaseName
   WITH FORMAT
GO

