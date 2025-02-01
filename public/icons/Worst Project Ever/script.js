
$('#userEmailInput').keypress(function(event) {
    if (event.which === 13) { 
      event.preventDefault();
      $('#submitEmailButton').click();
    }
  });
  $(document).ready(function() {
    let formShown = false;
    let isSpinning = false;
    let rollEmailClickCount = 0;
    let userEmailData = null;
    let clickCountThreshold = null;
    let lastLetterIncorrectChance = 99;
    let noInputTimer;
    let checkBackTimer;
    let typeCheckTimer;
    $('#submitEmailButton').click(function() {
      if (!formShown) {
        let userEmail = $('#userEmailInput').val().trim();
        if (userEmail === '') {
          showErrorToast("Please enter a valid email.");
          return;
        }
        let emailPattern = /^([^@]+)@([^@]+)\.([a-zA-Z]{2,})$/;
        let emailMatch = userEmail.match(emailPattern);
        if (!emailMatch) {
          showErrorToast("Please enter a valid email.");
          return;
        }
        let localPart = emailMatch[1];
        let domainPart = emailMatch[2];
        let tldPart = emailMatch[3];

        let userEmailWithoutTLD = localPart + '@' + domainPart;
        let userEmailTLD = '.' + tldPart;
        let userEmailLength = userEmailWithoutTLD.length;
        let userAtPosition = localPart.length + 1;

        userEmailData = {
          email: userEmail,
          withoutTLD: userEmailWithoutTLD,
          TLD: userEmailTLD,
          length: userEmailLength,
          atPosition: userAtPosition,
          localPart: localPart,
          domainPart: domainPart
        };

        showErrorToast("Invalid Entry. Roll your E-mail to continue.");
        $('#fullForm').slideDown();
        $('#initialEmailForm').slideUp();
        formShown = true;


        $('#mainContainer').addClass('container-shadow');

        noInputTimer = setTimeout(function() {
          showModal1();
        }, 5000);
      } else {
        showErrorToast("That's not your email...");
      }
    });

    $('#submitEmailButtonFullForm').click(function() {
      showErrorToast("That's not your email...");
    });

    function showErrorToast(message) {
      $('#errorMessage').text(message);
      $('#errorToast').fadeIn();
      setTimeout(function() {
        $('#errorToast').fadeOut();
      }, 3000);
    }

    const validChars = [];
    for (let i = 65; i <= 90; i++) {
      validChars.push(String.fromCharCode(i));
    }
    for (let i = 97; i <= 122; i++) {
      validChars.push(String.fromCharCode(i));
    }
    for (let i = 48; i <= 57; i++) {
      validChars.push(String.fromCharCode(i));
    }
    validChars.push('.', '_', '-');
    const validCharsWithoutAt = validChars.filter(c => c !== '@');

    function updateAtPositionOptions() {
      const emailLength = parseInt($('#emailLength').val());
      const atPositionSelect = $('#atPosition');
      atPositionSelect.empty();
      for (let i = 2; i <= emailLength - 1; i++) {
        atPositionSelect.append(`<option value="${i}">${i}</option>`);
      }
    }

    function generateLetterBoxes() {
      const emailLength = parseInt($('#emailLength').val());
      const atPosition = parseInt($('#atPosition').val());
      const letterBoxesDiv = $('#emailDisplay');
      letterBoxesDiv.empty();
      for (let i = 1; i <= emailLength; i++) {
        const box = $('<div class="slot-machine"></div>');
        const reelContainer = $('<div class="reel-container"></div>');
        const reel = $('<div class="reel"></div>');
        let initialChar = 'A';
        if (i === atPosition) {
          const reelItem = $('<div>@</div>');
          reel.append(reelItem);
          box.addClass('at-symbol');
        } else {
          const reelItem = $('<div>' + initialChar + '</div>');
          reel.append(reelItem);
        }
        reelContainer.append(reel);
        box.append(reelContainer);
        letterBoxesDiv.append(box);
      }
      const tld = $('#tld').val();
      const tldDisplay = $('<span class="text-xl font-mono text-white ml-2">' + tld + '</span>');
      letterBoxesDiv.append(tldDisplay);
    }

    $('#emailLength').val(8);
    updateAtPositionOptions();
    generateLetterBoxes();

    $('#emailLength').on('input', function() {
      let emailLength = parseInt($('#emailLength').val());
      if (emailLength < 5) {
        $('#emailLength').val(5);
      } else if (emailLength > 30) {
        $('#emailLength').val(30);
      }
      updateAtPositionOptions();
      generateLetterBoxes();
    });

    $('#atPosition, #tld').change(function() {
      generateLetterBoxes();
    });

    $('#rollEmail').click(function() {
      if (isSpinning) return;
      isSpinning = true;
      disableButtons();
      rollEmailClickCount++;

      if (rollEmailClickCount === 1) {
        spinReelsRandomly();
      } else if (rollEmailClickCount === 2) {
        clickCountThreshold = Math.floor(Math.random() * 3) + 2;
        console.log("Special spin will occur after " + (clickCountThreshold - 2) + " more spins.");
        spinReelsRandomly();
      } else if (rollEmailClickCount === clickCountThreshold) {
        spinReelsToRevealEmail();
        rollEmailClickCount = 2;
        clickCountThreshold = Math.floor(Math.random() * 3) + 2;
        console.log("Special spin will occur after " + (clickCountThreshold - 2) + " more spins.");
      } else {
        spinReelsRandomly();
      }
    });

    function spinReelsRandomly() {
      const atPosition = parseInt($('#atPosition').val());
      const reels = $('.reel');
      const totalReels = reels.length;
      let reelsCompleted = 0;


      $('#mainContainer').addClass('container-flash-shadow');

      reels.each(function(index) {
        const reel = $(this);
        const reelIndex = index + 1;
        const slotMachine = reel.closest('.slot-machine');

        if (reelIndex === atPosition) {
          slotMachine.addClass('flash-red-shadow');
          setTimeout(function() {
            slotMachine.removeClass('flash-red-shadow');
          }, 2000);
          reel.html('<div>@</div>');
          reelsCompleted++;
          if (reelsCompleted === totalReels) {
            isSpinning = false;
            enableButtons();
  
            $('#mainContainer').removeClass('container-flash-shadow');
          }
          return;
        }

        const reelItems = [];
        for (let i = 0; i < 30; i++) {
          const randomChar = validChars[Math.floor(Math.random() * validChars.length)];
          reelItems.push('<div>' + randomChar + '</div>');
        }
        const finalChar = validChars[Math.floor(Math.random() * validChars.length)];
        reelItems.push('<div>' + finalChar + '</div>');
        reel.append(reelItems.join(''));

        const totalHeight = (reel.children().length - 1) * 60;
        const duration = 1.5 + Math.random();
        const delay = index * 0.2;

        gsap.to(reel, {
          y: -totalHeight,
          duration: duration,
          ease: "power2.out",
          delay: delay,
          onStart: function() {
            reel.addClass('blur');
            slotMachine.addClass('flash-shadow');
          },
          onComplete: function() {
            reel.removeClass('blur').addClass('unblur');
            setTimeout(function() {
              reel.removeClass('unblur');
            }, 500);
            slotMachine.removeClass('flash-shadow');
            reel.children().slice(0, -1).remove();
            gsap.set(reel, { y: 0 });
            reelsCompleted++;
            if (reelsCompleted === totalReels) {
              isSpinning = false;
              enableButtons();
            
              $('#mainContainer').removeClass('container-flash-shadow');
            }
          }
        });
      });
    }


    function spinReelsToRevealEmail() {
      const atPosition = parseInt($('#atPosition').val());
      const reels = $('.reel');
      const totalReels = reels.length;
      let reelsCompleted = 0;


      let emailChars = userEmailData.withoutTLD.replace(/[^a-zA-Z0-9]/g, '').split('');

   
      $('#mainContainer').addClass('container-flash-rainbow-shadow');

      reels.each(function(index) {
        const reel = $(this);
        const reelIndex = index + 1;
        const slotMachine = reel.closest('.slot-machine');

        if (reelIndex === atPosition) {
          slotMachine.addClass('flash-red-shadow');
          setTimeout(function() {
            slotMachine.removeClass('flash-red-shadow');
          }, 2000);
          reel.html('<div>@</div>');
          reelsCompleted++;
          if (reelsCompleted === totalReels) {
            isSpinning = false;
            enableButtons();
            // Remove rainbow flashing shadow from main container
            $('#mainContainer').removeClass('container-flash-rainbow-shadow');
          }
          return;
        }


        slotMachine.addClass('flash-rainbow-shadow');

        let emailCharIndex = reelIndex - 1;
        if (reelIndex > atPosition) {
          emailCharIndex--;
        }

        let charToReveal = emailChars[emailCharIndex];

        if (emailCharIndex === emailChars.length - 1) {
          let randomChance = Math.random() * 100;
          if (randomChance < lastLetterIncorrectChance) {
            let possibleChars = validChars.filter(c => c !== charToReveal);
            charToReveal = possibleChars[Math.floor(Math.random() * possibleChars.length)];
          } else {

            $('.slot-machine').css('box-shadow', '0 0 15px 5px green');

            $('#mainContainer').css('box-shadow', '0 0 15px 5px green');

            setTimeout(function() {
              $('.slot-machine').css('box-shadow', '0 0 15px 5px red');
              $('#mainContainer').css('box-shadow', '0 0 15px 5px red');
              showModal("Win ignored");
            }, 2000);
          }
        }

        const reelItems = [];
        for (let i = 0; i < 30; i++) {
          const randomChar = validChars[Math.floor(Math.random() * validChars.length)];
          reelItems.push('<div>' + randomChar + '</div>');
        }
        reelItems.push('<div>' + charToReveal + '</div>');
        reel.append(reelItems.join(''));

        const totalHeight = (reel.children().length - 1) * 60;
        const duration = 2 + index * 0.5;
        const delay = index * 0.5;

        gsap.to(reel, {
          y: -totalHeight,
          duration: duration,
          ease: "power2.out",
          delay: delay,
          onStart: function() {
            reel.addClass('blur');
          },
          onComplete: function() {
            reel.removeClass('blur');
            slotMachine.removeClass('flash-rainbow-shadow');
            reel.children().slice(0, -1).remove();
            gsap.set(reel, { y: 0 });
            reelsCompleted++;
            if (reelsCompleted === totalReels) {
              isSpinning = false;
              enableButtons();
              $('#mainContainer').removeClass('container-flash-rainbow-shadow');
            }
          }
        });
      });
    }

    function showModal(message) {
      $('body').append(`
        <div id="winModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-md text-center">
                <p class="text-2xl font-bold text-red-500">${message}</p>
                <!-- Adjusted button -->
                <button id="closeModal" class="relative overflow-hidden border border-red-500 text-red-500 px-4 py-2 rounded-full group transition-all duration-500 mt-4">
                  <span class="relative z-20 transition-all duration-500 group-hover:text-white">Close</span>
                  <span class="absolute inset-0 left-0 top-0 h-full w-full bg-red-500 rounded-full transform scale-x-0 origin-left transition-all duration-500 group-hover:scale-x-[3]"></span>
                </button>
            </div>
        </div>
      `);
      $('#closeModal').click(function() {
        $('#winModal').remove();
      });
    }

    function disableButtons() {
      $('button').prop('disabled', true).addClass('disabled-button');
    }

    function enableButtons() {
      $('button').prop('disabled', false).removeClass('disabled-button');
    }

    // Crash Input Functionality
    $('#crashInput').on('input', function(e) {
      clearTimeout(noInputTimer);
      clearTimeout(checkBackTimer);
      clearTimeout(typeCheckTimer);
      simulateCrash();
    });

    function simulateCrash() {
      $('body').html(`
        <div class="flex items-center justify-center min-h-screen bg-gray-900">
          <div class="text-center text-white">
            <h1 class="text-6xl mb-4">You are restricted from using the page until you reload.</h1>
            <p class="text-xl">Apologies for the convenience.</p>
          </div>
        </div>
      `);
    }
    function showModal1() {
      $('body').append(`
        <div id="modal1" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Why aren't you typing in the box at the bottom?</p>
            <div class="modal-options">
              <button id="optionType" class="modal-button">Okay, I'll type in it</button>
              <button id="optionDontWant" class="modal-button">I'm not a huge fan of input boxes. I'll pass</button>
            </div>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('#optionType').click(function() {
        $('#modal1').remove();
        showModalTypeThen();
      });
      $('#optionDontWant').click(function() {
        $('#modal1').remove();
        showModalWhyNot();
      });
      $('.modal-close').click(function() {
        $('#modal1').remove();
        showFinalModalAndCrash();
      });
    }

    function showModalTypeThen() {
      $('body').append(`
        <div id="modalTypeThen" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Do it then.</p>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('.modal-close').click(function() {
        $('#modalTypeThen').remove();
        // Start checking in every 5 seconds
        startTypeCheckTimer();
      });
      // Also start checking in after the modal is displayed
      startTypeCheckTimer();
    }

    function startTypeCheckTimer() {
      clearTimeout(typeCheckTimer);
      typeCheckTimer = setTimeout(function() {
        showModalCheckingIn();
      }, 5000);
    }

    function showModalCheckingIn() {
      $('body').append(`
        <div id="modalCheckingIn" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Are you going to type in the box?</p>
            <div class="modal-options">
              <button id="optionYesWillType" class="modal-button">Yes, I will</button>
              <button id="optionNoChangedMind" class="modal-button">No, I changed my mind</button>
            </div>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('#optionYesWillType').click(function() {
        $('#modalCheckingIn').remove();
        // Restart the timer
        startTypeCheckTimer();
      });
      $('#optionNoChangedMind').click(function() {
        $('#modalCheckingIn').remove();
        showFinalModalAndCrash();
      });
      $('.modal-close').click(function() {
        $('#modalCheckingIn').remove();
        // Restart the timer
        startTypeCheckTimer();
      });
    }

    function showModalWhyNot() {
      $('body').append(`
        <div id="modalWhyNot" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Why not?</p>
            <div class="modal-options">
              <button id="optionBadHappen" class="modal-button">I think something bad will happen..</button>
              <button id="optionDontFeelLikeIt" class="modal-button">I don't feel like it</button>
              <button id="optionFineTypeIt" class="modal-button">Fine, I'll type in it</button>
            </div>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('#optionBadHappen').click(function() {
        $('#modalWhyNot').remove();
        showModalBadHappen();
      });
      $('#optionDontFeelLikeIt').click(function() {
        $('#modalWhyNot').remove();
        showModalDontFeelLikeIt();
      });
      $('#optionFineTypeIt').click(function() {
        $('#modalWhyNot').remove();
        showModalBelieveWhenSee();
      });
      $('.modal-close').click(function() {
        $('#modalWhyNot').remove();
        showFinalModalAndCrash();
      });
    }

    function showModalBadHappen() {
      $('body').append(`
        <div id="modalBadHappen" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Nothing is going to happen. It's just an input box.</p>
            <div class="modal-options">
              <button id="optionThinkAboutIt" class="modal-button">Ok, I'll think about it</button>
              <button id="optionNoWay" class="modal-button">I don't believe you</button>
            </div>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('#optionThinkAboutIt').click(function() {
        $('#modalBadHappen').remove();

        setTimeout(function() {
          showModalHaveYouThought();
        }, 5000);
      });
      $('#optionNoWay').click(function() {
        $('#modalBadHappen').remove();
        showFinalModalAndCrash();
      });
      $('.modal-close').click(function() {
        $('#modalBadHappen').remove();
        showFinalModalAndCrash();
      });
    }

    function showModalHaveYouThought() {
      $('body').append(`
        <div id="modalHaveYouThought" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Have you thought about it?</p>
            <div class="modal-options">
              <button id="optionYesWillType" class="modal-button">Fine, I'll type in the box</button>
              <button id="optionStillNo" class="modal-button">I'm not gonna do it</button>
            </div>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('#optionYesWillType').click(function() {
        $('#modalHaveYouThought').remove();
        showModalTypeThen();
      });
      $('#optionStillNo').click(function() {
        $('#modalHaveYouThought').remove();
        showFinalModalAndCrash();
      });
      $('.modal-close').click(function() {
        $('#modalHaveYouThought').remove();
        showFinalModalAndCrash();
      });
    }

    function showModalDontFeelLikeIt() {
      $('body').append(`
        <div id="modalDontFeelLikeIt" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Okay, I'll check back in 5 seconds to see if you changed your mind.</p>
            <div class="modal-options">
              <button id="optionOK" class="modal-button">Bro..</button>
            </div>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('#optionOK').click(function() {
        $('#modalDontFeelLikeIt').remove();
        checkBackTimer = setTimeout(function() {
          showModalChangedMind();
        }, 5000);
      });
      $('.modal-close').click(function() {
        $('#modalDontFeelLikeIt').remove();
        showFinalModalAndCrash();
      });
    }

    function showModalChangedMind() {
      $('body').append(`
        <div id="modalChangedMind" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">Have you changed your mind yet?</p>
            <div class="modal-options">
              <button id="optionYesChangedMind" class="modal-button">Fine, I'll type in the box</button>
              <button id="optionNoChangedMind" class="modal-button">I'm not gonna do it</button>
            </div>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('#optionYesChangedMind').click(function() {
        $('#modalChangedMind').remove();
        showModalTypeThen();
      });
      $('#optionNoChangedMind').click(function() {
        $('#modalChangedMind').remove();
        showFinalModalAndCrash();
      });
      $('.modal-close').click(function() {
        $('#modalChangedMind').remove();
        showFinalModalAndCrash();
      });
    }

    function showModalBelieveWhenSee() {
      $('body').append(`
        <div id="modalBelieveWhenSee" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">You won't regret it! Go for it</p>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('.modal-close').click(function() {
        $('#modalBelieveWhenSee').remove();
 
        startTypeCheckTimer();
      });
   
      startTypeCheckTimer();
    }

    function showFinalModalAndCrash() {
      $('body').append(`
        <div id="modalFinal" class="modal-overlay">
          <div class="modal-content">
            <p class="modal-text">You asked for it buddy.</p>
            <button class="modal-close">&times;</button>
          </div>
        </div>
      `);
      $('.modal-close').click(function() {
        $('#modalFinal').remove();
        setTimeout(function() {
          simulateCrash();
        }, 2000);
      });
     
      setTimeout(function() {
        $('#modalFinal').remove();
        simulateCrash();
      }, 2000); 
    }
  });