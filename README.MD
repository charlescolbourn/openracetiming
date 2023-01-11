# OpenRaceTiming

## Description
OpenRaceTiming is intended to be a fully open source race timing system with the following features:

* NFC/RFID scanning
* Barcode scanning
* Manual timing
* Import of entry lists from csv (e.g. SIEntries)
* Multi device finish/CP scanning
* Mass start
* Staggered start

v1.0.0a (Current) is an alpha version of the functionality described in 1.0.0 below. You can create
a race, import a csv, time a race using NFC tags and get the results. The test suite isn't great, 
there's a lot more to do there.

## How to use

Step 1: Create a race

In the 'settings' tab you can click on 'new race', then click on 'race name' to enter the race name.

Next click on 'click to set race date' which will bring up a date setting dialogue.

Finally click on 'add race' to add the race to the database.

Step 2: Register entrants

You'll need a csv file with entrants details in. The first two columns are combined to create 
the identifier so make sure they combine to make a unique name/string.

The output of the race will be this file with 2 new columns.

Choose your file using the 'import csv' button. 'Add Entry' doesn't do anything yet.

Now you'll need to register each entrants nfc tag. Tap on each entrant in turn and present the nfc
tag to the right place on the phone. It'll make a sound and the tag ID will appear.

You can buy tags from various places. I used these for testing:

https://www.ebay.co.uk/itm/281868752833

You'll need to run on a device with an NFC reader. Most mobile phones these days support NFC.

Step 3: Start the race

In the 'Timing' tab there is a button to start the race. Once started the button will change to 
'finish' and grey out. 'Finish' doesn't do anything yet.

As each racer reaches the end, scan their nfc tag with the phone. Their finish time will appear in
the list on the Timing page.

At any time in the race you can go to 'Results' and refresh the view to see all finishers.

Step 4: output the results

In the 'Results' tab, click on 'write to file' and choose an output location for the results. The 
app will output your original csv file with 2 new columns - the nfc id and time for each racer.

Note: You can wipe the entire content of the app using 'clear all' in the settings page. This will be
hidden in later versions, but is available in the prototype.


## Roadmap

v1.0.0 - Mass start, NFC scanning at finish. Import of entrant spreadsheet/manually
  add names. Output of results spreadsheet.

v1.1.0 - basic multi device with local networking

v1.2.0 - Mass start, multi device NFC finish

v1.3.0 - Mass start, multi device NFC checkpoints and finish, localisation

v1.4.0 - Observer/results mode. (Possible sls framework API to record times)

## Next Steps

refactor display in registration

Implement more tests

get list of races to update after creating one

Fix babel/jest issue stopping tsx tests working

register race number against entry


## Use Cases

Single device, start race, record times (nfc only)

Multiple device: A starts race and records times; B records tags/race numbers

Multiple device: A starts race; B records times; C records tags/numbers

Multiple device: A starts race and records times; B records tags/numbers; C, D, E are checkpoints

## Services

Recording start(s)

Recording finishes

Recording checkpoints


## Ideas, sensible or wacky

Push/pull times list from timer device to identity device to perform tallying via local networking
instead of online service. 

Link to camera taking photos of finishers to audit finish (trigger camera on phone? external nfc reader?)

EoD - someone taking details and pushing to the API

Drop downs for category & club

Notification from previous CP when first runners come through

Compile for Desktop RN & test

Just a note: there is a trade off - accurate vs easy. The NFC path is really easy for the 
 marshalls/RO, but not as accurate as 'click to finish'. The traditional 'click to finish' then
 reconcile with the race numbers in a funnel is super-accurate, but harder to manage.

OCR based EoD

## APIs to implement

Upload times

Upload finishers

Upload results

Get times

Get finishers

Get results

Upload entries


## Multi device p2p support

master device creates race

others have to pull

entries are keyed on nfc id but rename it as unique id to support non-electronic timing

'sync' button that checks for other devices in range and compares dbs.

dialogue to say what dbs to sync (just entries and currently selected race to start with)

First step - find all devices running ORT

assume that we don't write /anything/ for entries with a device id

entry states: entered, registered

Bluetooth is a non-starter, can't do phone to phone

-----------------------------------------------------------------------------
OpenRaceTiming is copyright 2022 C W Colbourn. It is released under the GPLv3.
Please see the bundled LICENSE.txt for details.